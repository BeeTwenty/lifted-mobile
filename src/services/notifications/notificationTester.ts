
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativePlatform, isAndroidPlatform, logPlatformInfo } from './utils/platformUtils';
import { registerNotificationChannel } from './notificationChannels';

/**
 * Send an immediate test notification
 * This is useful for testing notification permissions and delivery
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    // Log detailed information for debugging
    logPlatformInfo();
    console.log('Testing notification support...');

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
      await registerNotificationChannel();
    }

    // Generate a unique ID for this notification
    const notificationId = new Date().getTime();
    
    // Try multiple notification approaches in sequence until one works
    
    // 1. Try immediate notification with minimal properties
    try {
      console.log('Attempting immediate basic notification...');
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: 'Test Notification',
            body: 'This is a test notification from Lifted app!',
          }
        ]
      });
      console.log('Immediate basic notification sent');
      return true;
    } catch (error) {
      console.warn('Basic notification failed:', error);
      
      // 2. Try with short delay (2 seconds)
      try {
        console.log('Attempting short-delay notification...');
        const delayTime = new Date(Date.now() + 2000);
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId + 1,
              title: 'Test Notification (Delayed)',
              body: 'This is a delayed test notification!',
              schedule: { at: delayTime }
            }
          ]
        });
        console.log('Short-delay notification scheduled');
        return true;
      } catch (error2) {
        console.warn('Short-delay notification failed:', error2);
        
        // 3. Try with Android-specific options
        if (isAndroidPlatform()) {
          try {
            console.log('Attempting Android-specific notification...');
            await LocalNotifications.schedule({
              notifications: [
                {
                  id: notificationId + 2,
                  title: 'Test Notification (Android)',
                  body: 'Android test notification with channel',
                  schedule: { at: new Date(Date.now() + 3000) },
                  channelId: 'workout-timer',
                  smallIcon: 'ic_stat_icon_config_sample',
                  largeIcon: 'ic_stat_icon_config_sample',
                  iconColor: '#488AFF'
                }
              ]
            });
            console.log('Android-specific notification scheduled');
            return true;
          } catch (error3) {
            console.error('All notification attempts failed:', error3);
            return false;
          }
        }
        return false;
      }
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};
