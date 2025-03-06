
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
    
    // Schedule the notification using a more direct approach
    try {
      const scheduleTime = new Date(Date.now() + delay * 1000);
      console.log(`Scheduling notification for: ${scheduleTime.toISOString()}`);
      
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: 'Rest Complete',
            body: getRandomMessage(),
            largeBody: "Your rest period is complete. Time to get back to your workout!",
            summaryText: "Workout timer",
            sound: null, // Using null lets Android use the default sound
            smallIcon: 'ic_stat_icon_config_sample',
            largeIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF',
            attachments: null,
            actionTypeId: null,
            extra: null,
            schedule: { 
              at: scheduleTime,
              allowWhileIdle: true,
            },
            channelId: 'workout-timer'
          }
        ]
      });

      console.log(`Notification scheduled with ID: ${notificationId}`);
      return notificationId;
    } catch (e) {
      console.error("Error scheduling notification:", e);
      return null;
    }
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
export const registerNotificationChannel = async (): Promise<boolean> => {
  if (Capacitor.getPlatform() === 'android') {
    try {
      console.log('Creating notification channel for Android...');
      
      // First try to delete any existing channel
      try {
        const channels = await LocalNotifications.listChannels();
        for (const channel of channels.channels) {
          if (channel.id === 'workout-timer') {
            console.log(`Deleting existing channel: ${channel.id}`);
            await LocalNotifications.deleteChannel({ id: channel.id });
          }
        }
      } catch (e) {
        console.log('Error checking existing channels:', e);
      }
      
      // Now create a new channel
      await LocalNotifications.createChannel({
        id: 'workout-timer',
        name: 'Workout Timer',
        description: 'Notifications for workout rest timers',
        importance: 5, // High importance for timers
        visibility: 1,
        sound: null, // Let Android use default sound
        vibration: true,
        lights: true,
        lightColor: '#FF0000' // Red light for visibility
      });
      
      console.log('Android notification channel created successfully');
      
      // List channels to verify
      const channels = await LocalNotifications.listChannels();
      console.log('Available notification channels:', channels);
      
      return channels.channels.some(channel => channel.id === 'workout-timer');
    } catch (error) {
      console.error('Error creating notification channel:', error);
      return false;
    }
  }
  return true; // Return true for non-Android platforms
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
