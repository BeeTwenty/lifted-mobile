import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

// Collection of motivational messages
const motivationalMessages = [
  "Time to get back to your workout! 💪",
  "Rest complete! Let's crush the next set! 🔥",
  "Break's over - time to build that strength! 💯",
  "Ready to continue? Your body is waiting! 🏋️",
  "You've rested enough - back to making progress! 🚀",
  "Rest complete! Remember, consistency is key! ⏱️",
  "Your muscles are ready for the next challenge! 🏆",
  "Break time's up! Keep pushing your limits! 🙌",
  "Get ready for your next set! You're doing great! 👊",
  "Time to get back to work! Every rep counts! 💪"
];

// Get a random motivational message
const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};

/**
 * Check if notifications are supported
 */
export const checkNotificationsSupport = async (): Promise<boolean> => {
  // When running in a browser that doesn't support Capacitor
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const { display } = await LocalNotifications.checkPermissions();
    if (display === 'granted') {
      return true;
    }
    
    const { display: requestedPermission } = await LocalNotifications.requestPermissions();
    return requestedPermission === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a rest timer completion notification
 * @param delay Time in seconds before notification should be shown
 * @returns The notification ID if scheduled successfully, null otherwise
 */
export const scheduleRestEndNotification = async (delay: number): Promise<number | null> => {
  // Only attempt to schedule if we're running on a supported platform
  if (!Capacitor.isNativePlatform()) {
    console.log('Notifications not supported in this environment');
    return null;
  }

  try {
    const permissionGranted = await checkNotificationsSupport();
    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return null;
    }

    // Generate a unique ID for this notification
    const notificationId = new Date().getTime();
    
    // Schedule the notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: 'Rest Complete',
          body: getRandomMessage(),
          sound: 'notification.mp3',
          schedule: { at: new Date(Date.now() + delay * 1000) },
          actionTypeId: 'WORKOUT_TIMER',
          extra: {
            data: 'rest_timer_complete'
          }
        }
      ]
    });

    return notificationId;
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
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};
