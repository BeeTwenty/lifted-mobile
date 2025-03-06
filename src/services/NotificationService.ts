
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
    console.log('Not running on native platform, skipping notifications');
    return false;
  }

  try {
    console.log('Checking notification permissions...');
    const { display } = await LocalNotifications.checkPermissions();
    console.log('Current permission status:', display);
    
    if (display === 'granted') {
      return true;
    }
    
    console.log('Requesting notification permissions...');
    const { display: requestedPermission } = await LocalNotifications.requestPermissions();
    console.log('Requested permission result:', requestedPermission);
    
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
    console.log(`Attempting to schedule notification with delay: ${delay} seconds`);
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
          sound: true,
          schedule: { at: new Date(Date.now() + delay * 1000) },
          actionTypeId: 'WORKOUT_TIMER',
          extra: {
            data: 'rest_timer_complete'
          }
        }
      ]
    });

    console.log(`Notification scheduled with ID: ${notificationId}`);
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
    console.log(`Cancelling notification with ID: ${notificationId}`);
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

// Register notification channel for Android
export const registerNotificationChannel = async (): Promise<void> => {
  if (Capacitor.getPlatform() === 'android') {
    try {
      await LocalNotifications.createChannel({
        id: 'workout-timer',
        name: 'Workout Timer',
        description: 'Notifications for workout rest timers',
        importance: 5,
        visibility: 1,
        sound: 'notification.mp3',
        vibration: true,
        lights: true
      });
      console.log('Android notification channel created');
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
};

// Initialize notifications
export const initializeNotifications = async (): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Register for push notifications
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
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }
};
