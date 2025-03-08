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
    if (!isNativePlatform()) {
      console.log(`Not scheduling notification - not on native platform`);
      return null;
    }

    logPlatformInfo();
    console.log(`Attempting to schedule notification with delay: ${delay} seconds`);

    // Explicitly check & request permissions
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

    // Generate a safe integer ID for the notification
    const pending = await LocalNotifications.getPending();
console.log("Pending notifications:", pending.notifications);

// Correct way to retrieve last ID
const lastId = pending.notifications.length > 0 
  ? pending.notifications[pending.notifications.length - 1].id 
  : 0;

// Use a random safe ID within Java's int range
const notificationId = Math.trunc(Math.random() * 100000);
console.log("Generated notification ID:", notificationId, typeof notificationId);

    // Ensure the notification channel is created on Android
    if (isAndroidPlatform()) {
      const channelCreated = await registerNotificationChannel();
      console.log(`Notification channel created/verified: ${channelCreated}`);
      if (!channelCreated) {
        console.warn('Could not create notification channel');
      }
    }

    // Calculate the schedule time
    const scheduleTime = new Date(Date.now() + delay * 1000);
    console.log(`Scheduling notification for: ${scheduleTime.toISOString()}`);

    // Ensure a minimum delay of 5 seconds
    if (delay < 5) {
      console.log('Delay too short, setting minimum 5-second delay');
      scheduleTime.setTime(Date.now() + 5000);
    }

    let scheduled = false;
    let attempts = 0;
    const maxAttempts = 3;

    // Try scheduling with fallback attempts
    while (!scheduled && attempts < maxAttempts) {
      attempts++;
      console.log(`Scheduling attempt ${attempts}/${maxAttempts}`);

      try {
        const title = 'Rest Complete';
        const body = getRandomMessage();

        if (attempts === 1) {
          // First attempt - full feature
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
          // Second attempt - simplified
          await LocalNotifications.schedule({
            notifications: [{
              id: notificationId,
              title,
              body,
              schedule: { at: scheduleTime }
            }]
          });
        } else {
          // Final attempt - immediate fallback
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
        const newPending = await LocalNotifications.getPending();
        console.log('Pending notifications after scheduling:', newPending);

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
