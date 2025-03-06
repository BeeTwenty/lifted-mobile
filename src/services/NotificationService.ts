
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
  try {
    // Check if running on a native platform
    if (!Capacitor.isNativePlatform()) {
      console.log('Not running on native platform, skipping notifications');
      return false;
    }

    console.log('Checking notification permissions...');
    console.log('Platform:', Capacitor.getPlatform());
    
    // First check existing permissions
    const { display } = await LocalNotifications.checkPermissions();
    console.log('Current permission status:', display);
    
    if (display === 'granted') {
      return true;
    }
    
    // If not granted, request permissions
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
  try {
    // Only attempt to schedule if we're running on a supported platform
    if (!Capacitor.isNativePlatform()) {
      console.log('Notifications not supported in this environment');
      return null;
    }

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
    if (Capacitor.getPlatform() === 'android') {
      await registerNotificationChannel();
    }
    
    // Schedule the notification with all possible options to ensure delivery
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: 'Rest Complete',
          body: getRandomMessage(),
          sound: 'default',
          schedule: { 
            at: new Date(Date.now() + delay * 1000),
            allowWhileIdle: true,
          },
          actionTypeId: 'WORKOUT_TIMER',
          channelId: 'workout-timer',
          ongoing: false,
          autoCancel: true,
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
 * Send an immediate test notification
 * This is useful for testing notification permissions and delivery
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    // Log more information for debugging
    console.log('Testing notification support...');
    console.log('Platform:', Capacitor.getPlatform());
    console.log('Is native:', Capacitor.isNativePlatform());

    if (!Capacitor.isNativePlatform()) {
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
    if (Capacitor.getPlatform() === 'android') {
      await registerNotificationChannel();
    }

    // Generate a unique ID for this notification
    const notificationId = new Date().getTime();
    
    // Send an immediate notification
    console.log('Scheduling immediate test notification...');
    
    // First, get all pending notifications
    const pendingNotifications = await LocalNotifications.getPending();
    console.log('Pending notifications:', pendingNotifications);
    
    // Schedule the notification for 2 seconds in the future
    // This helps ensure the notification is actually delivered
    await LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: 'Test Notification',
          body: 'This is a test notification from Lifted app!',
          schedule: { at: new Date(Date.now() + 2000) },
          sound: 'default',
          channelId: 'workout-timer',
          ongoing: false,
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#488AFF',
        }
      ]
    });

    console.log(`Test notification sent with ID: ${notificationId}`);
    
    // Return list of registered notification channels
    if (Capacitor.getPlatform() === 'android') {
      const channels = await LocalNotifications.listChannels();
      console.log('Available notification channels:', channels);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
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
      console.log('Creating notification channel for Android...');
      await LocalNotifications.createChannel({
        id: 'workout-timer',
        name: 'Workout Timer',
        description: 'Notifications for workout rest timers',
        importance: 5, // High importance for timers
        visibility: 1,
        sound: 'default',
        vibration: true,
        lights: true,
        lightColor: '#FF0000' // Red light for visibility
      });
      console.log('Android notification channel created successfully');
      
      // List channels to verify
      const channels = await LocalNotifications.listChannels();
      console.log('Available notification channels:', channels);
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
};

// Initialize notifications
export const initializeNotifications = async (): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
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
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }
};
