
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativePlatform, isAndroidPlatform } from './utils/platformUtils';
import { registerNotificationChannel } from './notificationChannels';

/**
 * Send an immediate test notification
 * This is useful for testing notification permissions and delivery
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    // Log more information for debugging
    console.log('Testing notification support...');
    console.log('Platform:', await import('@capacitor/core').then(m => m.Capacitor.getPlatform()));
    console.log('Is native:', isNativePlatform());

    if (!isNativePlatform()) {
      console.log('Notifications not supported in browser environment');
      return false;
    }

    // Get notification permissions
    console.log('Sending test notification - checking permissions first...');
    const permissionCheck = await LocalNotifications.checkPermissions();
    console.log('Permission status:', permissionCheck);
    
    if (permissionCheck.display !== 'granted') {
      console.log('Requesting permissions explicitly...');
      const requestResult = await LocalNotifications.requestPermissions();
      console.log('Request result:', requestResult);
      
      if (requestResult.display !== 'granted') {
        console.log('Permission denied after explicit request');
        return false;
      }
    }

    // Ensure the notification channel is created
    if (isAndroidPlatform()) {
      const success = await registerNotificationChannel();
      if (!success) {
        console.error("Failed to create notification channel");
        return false;
      }
    }

    // Generate a unique ID for this notification
    const notificationId = new Date().getTime();
    
    // Try immediate notification with minimal properties first
    console.log('Scheduling immediate test notification with minimal properties...');
    
    try {
      // Delay for 1 second to ensure timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send now
      const scheduleResult = await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: 'Test Notification',
            body: 'This is a test notification from Lifted app!',
          }
        ]
      });
      
      console.log("Schedule result:", scheduleResult);
      console.log(`Test notification sent with ID: ${notificationId}`);
      
      return true;
    } catch (e) {
      console.error("First notification attempt failed:", e);
      
      // Try with a delayed schedule as backup
      try {
        console.log("Trying with delay and explicit channel...");
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId + 1,
              title: 'Test Notification (Backup)',
              body: 'This is a backup test notification!',
              schedule: { at: new Date(Date.now() + 3000) },
              channelId: 'workout-timer'
            }
          ]
        });
        
        console.log(`Backup notification scheduled with ID: ${notificationId + 1}`);
        return true;
      } catch (backupError) {
        console.error("Backup notification failed:", backupError);
        return false;
      }
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};
