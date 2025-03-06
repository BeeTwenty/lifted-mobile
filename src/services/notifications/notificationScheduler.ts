
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativePlatform, isAndroidPlatform, logPlatformInfo } from './utils/platformUtils';
import { getRandomMessage } from './utils/notificationMessages';
import { registerNotificationChannel } from './notificationChannels';

/**
 * Schedule a rest timer completion notification
 * @param delay Time in seconds before notification should be shown
 * @returns The notification ID if scheduled successfully, null otherwise
 */
export const scheduleRestEndNotification = async (delay: number): Promise<number | null> => {
  try {
    // Only attempt to schedule if we're running on a supported platform
    if (!isNativePlatform()) {
      return null;
    }

    // Log detailed platform information
    logPlatformInfo();
    console.log(`Attempting to schedule notification with delay: ${delay} seconds`);
    
    // Explicitly check permissions here
    const permissionStatus = await LocalNotifications.checkPermissions();
    console.log('Permission status before scheduling:', permissionStatus);
    
    if (permissionStatus.display !== 'granted') {
      console.log('Requesting permissions before scheduling...');
      const requestResult = await LocalNotifications.requestPermissions();
      console.log('Request result:', requestResult);
      
      if (requestResult.display !== 'granted') {
        console.log('Permission denied after explicit request');
        return null;
      }
    }

    // Generate a unique ID for this notification
    const notificationId = new Date().getTime();
    
    // Ensure the notification channel is created
    if (isAndroidPlatform()) {
      const channelCreated = await registerNotificationChannel();
      console.log(`Notification channel created/verified: ${channelCreated}`);
    }
    
    // Schedule the notification using a more direct approach
    try {
      const scheduleTime = new Date(Date.now() + delay * 1000);
      console.log(`Scheduling notification for: ${scheduleTime.toISOString()}`);
      
      // Create a simpler notification object first
      const notificationConfig = {
        notifications: [
          {
            id: notificationId,
            title: 'Rest Complete',
            body: getRandomMessage(),
            schedule: { 
              at: scheduleTime,
              allowWhileIdle: true,
            },
            // Only add these properties for Android
            ...(isAndroidPlatform() ? {
              largeBody: "Your rest period is complete. Time to get back to your workout!",
              summaryText: "Workout timer",
              smallIcon: 'ic_stat_icon_config_sample',
              largeIcon: 'ic_stat_icon_config_sample',
              iconColor: '#488AFF',
              channelId: 'workout-timer'
            } : {})
          }
        ]
      };
      
      console.log('Notification config:', JSON.stringify(notificationConfig, null, 2));
      await LocalNotifications.schedule(notificationConfig);

      console.log(`Notification scheduled with ID: ${notificationId}`);
      return notificationId;
    } catch (e) {
      console.error("Error scheduling notification:", e);
      
      // Try a fallback method with fewer options if the first approach failed
      try {
        console.log("Attempting fallback notification scheduling...");
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId,
              title: 'Rest Complete',
              body: getRandomMessage(),
              schedule: { at: new Date(Date.now() + delay * 1000) }
            }
          ]
        });
        console.log(`Fallback notification scheduled with ID: ${notificationId}`);
        return notificationId;
      } catch (fallbackError) {
        console.error("Fallback notification also failed:", fallbackError);
        return null;
      }
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

/**
 * Cancel a previously scheduled notification
 * @param notificationId The ID of the notification to cancel
 */
export const cancelNotification = async (notificationId: number): Promise<void> => {
  if (!isNativePlatform()) {
    return;
  }

  try {
    console.log(`Cancelling notification with ID: ${notificationId}`);
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};
