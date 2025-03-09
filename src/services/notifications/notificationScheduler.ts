
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativePlatform, isAndroidPlatform, logPlatformInfo } from './utils/platformUtils';
import { getRandomMessage } from './utils/notificationMessages';
import { registerNotificationChannel } from './notificationChannels';
import { Preferences } from '@capacitor/preferences';

const SCHEDULER_NOTIFICATION_ID_KEY = "schedulerLastNotificationId";

/**
 * Generate a unique notification ID within Java int range
 */
const getNextScheduledNotificationId = async (): Promise<number> => {
  try {
    const { value } = await Preferences.get({ key: SCHEDULER_NOTIFICATION_ID_KEY });

    // Start with a small base ID for rest timer notifications
    let lastId = value ? parseInt(value, 10) : 100;
    let nextId = lastId + 1;

    // Keep it smaller than 10000 to ensure it's well within Java int range
    if (nextId > 10000) {
      nextId = 101; // Reset to a small number
    }

    // Save the new last ID
    await Preferences.set({ key: SCHEDULER_NOTIFICATION_ID_KEY, value: nextId.toString() });

    console.log("Generated new scheduled notification ID:", nextId, "type:", typeof nextId);
    return nextId;
  } catch (error) {
    console.error("Error generating notification ID:", error);
    // Fallback to a random number between 101-999 if anything goes wrong
    return Math.floor(Math.random() * 899) + 101;
  }
};

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

    // Generate a dynamic notification ID within safe range
    const notificationId = await getNextScheduledNotificationId();
    console.log("Using dynamic notification ID:", notificationId, "type:", typeof notificationId);

    // Make sure the notification ID is recognized as a number
    const idAsNumber = Number(notificationId);
    console.log("ID as explicit number:", idAsNumber, "type:", typeof idAsNumber);

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
          // First attempt - full feature with improved background support
          await LocalNotifications.schedule({
            notifications: [{
              id: idAsNumber,
              title,
              body,
              schedule: { 
                at: scheduleTime,
                allowWhileIdle: true, // Critical for background operation
                repeats: false,       // Ensure no repeat
                every: 'minute',      // Fallback if repeat somehow gets activated
                count: 1              // Fallback limit to one notification
              },
              sound: isAndroidPlatform() ? 'default' : undefined,
              ...(isAndroidPlatform() ? {
                channelId: 'workout-timer',
                smallIcon: 'ic_stat_icon_config_sample',
                iconColor: '#488AFF',
                ongoing: false, // Don't make it persistent
                autoClear: true
              } : {})
            }]
          });
        } else if (attempts === 2) {
          // Second attempt - simplified with guaranteed background delivery
          await LocalNotifications.schedule({
            notifications: [{
              id: idAsNumber,
              title,
              body,
              schedule: { 
                at: scheduleTime,
                allowWhileIdle: true
              },
              sound: isAndroidPlatform() ? 'default' : undefined
            }]
          });
        } else {
          // Final attempt - immediate fallback
          const immediateTime = new Date(Date.now() + 2000);
          await LocalNotifications.schedule({
            notifications: [{
              id: idAsNumber,
              title: "Time's up!",
              body: "Get back to your workout.",
              schedule: { 
                at: immediateTime,
                allowWhileIdle: true 
              },
              sound: isAndroidPlatform() ? 'default' : undefined
            }]
          });
        }

        console.log(`Notification scheduled successfully on attempt ${attempts}`);
        scheduled = true;

        // Verify the notification was scheduled
        const newPending = await LocalNotifications.getPending();
        console.log('Pending notifications after scheduling:', newPending);

        return idAsNumber;
      } catch (error) {
        console.error(`Error scheduling notification (attempt ${attempts}):`, error);
      }
    }

    if (!scheduled) {
      console.error('All notification scheduling attempts failed');
      return null;
    }

    return idAsNumber;
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
