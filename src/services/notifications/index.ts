
import { LocalNotifications } from '@capacitor/local-notifications';
import { registerNotificationChannel } from './notificationChannels';
import { isNativePlatform } from './utils/platformUtils';

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
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }
};
