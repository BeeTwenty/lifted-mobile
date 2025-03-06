
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
      console.log(`Not scheduling notification - not on native platform`);
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
    const notificationId = Math.floor(Date.now() + Math.random() * 10000);
    
    // Ensure the notification channel is created
    if (isAndroidPlatform()) {
      const channelCreated = await registerNotificationChannel();
      console.log(`Notification channel created/verified: ${channelCreated}`);
      if (!channelCreated) {
        console.warn('Could not create notification channel');
      }
    }
    
    // Calculate schedule time
    const scheduleTime = new Date(Date.now() + delay * 1000);
    console.log(`Scheduling notification for: ${scheduleTime.toISOString()}`);
    
    // For very short delays (less than 5 seconds), use a minimum of 5 seconds
    // to avoid potential issues with immediate notifications
    if (delay < 5) {
      console.log('Delay too short, setting minimum 5 second delay');
      scheduleTime.setTime(Date.now() + 5000);
    }
    
    let scheduled = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    // Try different approaches with fallback options
    while (!scheduled && attempts < maxAttempts) {
      attempts++;
      console.log(`Scheduling attempt ${attempts}/${maxAttempts}`);
      
      try {
        const title = 'Rest Complete';
        const body = getRandomMessage();
        
        // Config varies by attempt
        if (attempts === 1) {
          // First attempt - full featured
          await LocalNotifications.schedule({
            notifications: [{
              id: notificationId,
              title,
              body,
              schedule: { 
                at: scheduleTime,
                allowWhileIdle: true 
              },
              ...(isAndroidPlatform() ? {
                channelId: 'workout-timer',
                smallIcon: 'ic_stat_icon_config_sample',
                iconColor: '#488AFF'
              } : {})
            }]
          });
        } else if (attempts === 2) {
          // Second attempt - simpler
          await LocalNotifications.schedule({
            notifications: [{
              id: notificationId,
              title,
              body,
              schedule: { at: scheduleTime }
            }]
          });
        } else {
          // Final attempt - immediate notification with small delay
          const immediateTime = new Date(Date.now() + 2000);
          await LocalNotifications.schedule({
            notifications: [{
              id: notificationId,
              title,
              body: "Time's up! Get back to your workout.",
              schedule: { at: immediateTime }
            }]
          });
        }
        
        console.log(`Notification scheduled successfully on attempt ${attempts}`);
        scheduled = true;
        
        // Verify the notification was scheduled
        const pending = await LocalNotifications.getPending();
        console.log('Pending notifications:', pending);
        
        return notificationId;
      } catch (error) {
        console.error(`Error scheduling notification (attempt ${attempts}):`, error);
      }
    }
    
    if (!scheduled) {
      console.error('All notification scheduling attempts failed');
      return null;
    }
    
    return notificationId;
  } catch (error) {
    console.error('Error in scheduleRestEndNotification:', error);
    return null;
  }
};

/**
 * Cancel a previously scheduled notification
 * @param notificationId The ID of the notification to cancel
 */
export const cancelNotification = async (notificationId: number): Promise<void> => {
  if (!isNativePlatform() || !notificationId) {
    return;
  }

  try {
    console.log(`Cancelling notification with ID: ${notificationId}`);
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
    
    // Verify cancellation
    const pending = await LocalNotifications.getPending();
    console.log('Pending notifications after cancellation:', pending);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};
