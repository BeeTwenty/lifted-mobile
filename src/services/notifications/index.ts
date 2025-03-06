
import { LocalNotifications } from '@capacitor/local-notifications';
import { registerNotificationChannel } from './notificationChannels';
import { isNativePlatform, logPlatformInfo } from './utils/platformUtils';

// Re-export all the notification modules
export { checkNotificationsSupport } from './notificationPermissions';
export { scheduleRestEndNotification, cancelNotification } from './notificationScheduler';
export { sendTestNotification } from './notificationTester';
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
      
      // Register notification channel
      await registerNotificationChannel();
      
      // Add notification received handler
      LocalNotifications.addListener('localNotificationReceived', (notification) => {
        console.log('Notification received:', notification);
      });
      
      // Add notification action performed handler
      LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
        console.log('Notification action performed:', notificationAction);
      });
      
      console.log('Notification listeners registered');
      
      // Pre-check permissions on initialization
      const permissionStatus = await LocalNotifications.checkPermissions();
      console.log('Initial notification permission status:', permissionStatus);
      
      // If not granted, immediately request
      if (permissionStatus.display !== 'granted') {
        const requestResult = await LocalNotifications.requestPermissions();
        console.log('Permission request result:', requestResult);
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
