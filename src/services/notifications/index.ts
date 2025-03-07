
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { registerNotificationChannel } from './notificationChannels';
import { isNativePlatform, logPlatformInfo } from './utils/platformUtils';
import { initializePushListeners } from './notificationTester';

// Re-export all the notification modules
export { checkNotificationsSupport } from './notificationPermissions';
export { scheduleRestEndNotification, cancelNotification } from './notificationScheduler';
export { sendTestNotification, initializePushListeners } from './notificationTester';
export { registerNotificationChannel } from './notificationChannels';

/**
 * Initialize notifications
 * Sets up notification channels and registers event listeners
 */
export const initializeNotifications = async (): Promise<void> => {
  if (isNativePlatform()) {
    try {
      console.log('Initializing notifications...');
      
      // Log platform details for debugging
      logPlatformInfo();
      
      // Register notification channel early
      await registerNotificationChannel();
      
      // Add notification received handler
      LocalNotifications.addListener('localNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
      });
      
      // Add notification action performed handler
      LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
        console.log('Notification action performed:', notificationAction);
      });
      
      console.log('Local notification listeners registered');
      
      // Initialize push notification listeners
      await initializePushListeners();
      
      // Pre-check permissions on initialization
      const permissionStatus = await LocalNotifications.checkPermissions();
      console.log('Initial notification permission status:', permissionStatus);
      
      // If not granted, immediately request
      if (permissionStatus.display !== 'granted') {
        console.log('Requesting permissions during initialization...');
        const requestResult = await LocalNotifications.requestPermissions();
        console.log('Initial permission request result:', requestResult);
      }
      
      // Check push notification permissions
      try {
        console.log('Checking push notification permissions...');
        const pushPermStatus = await PushNotifications.checkPermissions();
        console.log('Push permission status:', pushPermStatus);
        
        if (pushPermStatus.receive !== 'granted') {
          console.log('Requesting push notification permissions...');
          const pushResult = await PushNotifications.requestPermissions();
          console.log('Push permission request result:', pushResult);
          
          if (pushResult.receive === 'granted') {
            console.log('Push notification permission granted, registering with FCM...');
            await PushNotifications.register();
          }
        } else {
          console.log('Push permissions already granted, registering with FCM...');
          await PushNotifications.register();
        }
      } catch (pushError) {
        console.error('Error setting up push notifications:', pushError);
      }
      
      // Test if notifications are working by sending a silent check
      try {
        console.log('Verifying notification system...');
        const now = new Date();
        const testNotificationId = now.getTime();
        
        // Schedule and immediately cancel a notification to test the system
        await LocalNotifications.schedule({
          notifications: [
            {
              id: testNotificationId,
              title: 'Notification System Check',
              body: 'This is a test notification that should be cancelled.',
              schedule: { at: new Date(now.getTime() + 60000) }
            }
          ]
        });
        
        // Immediately cancel the test notification
        await LocalNotifications.cancel({ notifications: [{ id: testNotificationId }] });
        console.log('Notification system verification completed');
      } catch (verifyError) {
        console.warn('Notification system verification failed:', verifyError);
      }
      
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  } else {
    console.log('Not initializing notifications - not on native platform');
  }
};
