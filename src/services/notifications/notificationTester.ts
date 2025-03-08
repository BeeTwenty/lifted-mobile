
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Preferences } from '@capacitor/preferences';
import { isNativePlatform, isAndroidPlatform } from './utils/platformUtils';
import { getRandomMessage } from './utils/notificationMessages';
import { registerNotificationChannel } from './notificationChannels';

const NOTIFICATION_ID_KEY = "lastNotificationId"; // Key for storing last ID in Preferences

/**
 * Generate a unique, persistent notification ID
 */
const getNextNotificationId = async (): Promise<number> => {
  try {
    const { value } = await Preferences.get({ key: NOTIFICATION_ID_KEY });
    
    // Start from 1 or increment the last value
    let lastId = value ? parseInt(value, 10) : 0;
    let nextId = lastId + 1;
    
    // Keep it smaller than 10000 to ensure it's well within Java int range
    if (nextId > 10000) {
      nextId = 1; // Reset to 1 if exceeded
    }
    
    // Save the new ID
    await Preferences.set({ key: NOTIFICATION_ID_KEY, value: nextId.toString() });
    
    console.log("Generated new notification ID:", nextId, "type:", typeof nextId);
    return nextId;
  } catch (error) {
    console.error("Error generating notification ID:", error);
    // Fallback to a very safe small number if anything goes wrong
    return 42;
  }
};

/**
 * Send a test notification to verify notifications are working
 * @returns Promise<boolean> indicating if the notification was sent successfully
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    if (!isNativePlatform()) {
      console.log('Not on native platform, cannot send test notification');
      return false;
    }

    console.log('Sending test notification...');

    if (isAndroidPlatform()) {
      try {
        console.log('Checking and registering for push notifications on Android...');
        
        const pushPermStatus = await PushNotifications.checkPermissions();
        console.log('Push permission status:', pushPermStatus);

        if (pushPermStatus.receive !== 'granted') {
          console.log('Requesting push notification permissions...');
          const pushResult = await PushNotifications.requestPermissions();
          console.log('Push permission request result:', pushResult);
          
          if (pushResult.receive === 'granted') {
            console.log('Push notification permission granted, registering with FCM...');
            await PushNotifications.register();
          } else {
            console.warn('Push notification permission denied');
          }
        } else {
          console.log('Push permissions already granted, registering with FCM...');
          await PushNotifications.register();
        }
      } catch (error) {
        console.error('Error setting up Firebase for push notifications:', error);
      }
    }

    if (isAndroidPlatform()) {
      await registerNotificationChannel();
    }

    const permStatus = await LocalNotifications.checkPermissions();
    console.log('Local notification permission status:', permStatus);

    if (permStatus.display !== 'granted') {
      console.log('Requesting local notification permissions...');
      const requestResult = await LocalNotifications.requestPermissions();
      console.log('Local notification permission request result:', requestResult);
      
      if (requestResult.display !== 'granted') {
        console.log('Local notification permission denied');
        return false;
      }
    }

    // Use a small integer value that's guaranteed to be within Java int range
    // Java integers range from -2^31 to 2^31 - 1 (-2,147,483,648 to 2,147,483,647)
    // But we'll use a very small number to be safe
    const notificationId = 42;
    console.log("Using fixed notification ID:", notificationId, "type:", typeof notificationId);

    // Make sure the notification ID is recognized as a number
    const idAsNumber = Number(notificationId);
    console.log("ID as explicit number:", idAsNumber, "type:", typeof idAsNumber);

    await LocalNotifications.schedule({
      notifications: [{
        id: idAsNumber,
        title: 'Test Notification',
        body: getRandomMessage(),
        schedule: { at: new Date(Date.now() + 2000) }, // Show after 2 seconds
        ...(isAndroidPlatform() ? {
          channelId: 'workout-timer',
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#488AFF'
        } : {})
      }]
    });

    console.log(`Test notification scheduled with ID: ${idAsNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

/**
 * Initialize Push Notification listeners
 */
export const initializePushListeners = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  
  try {
    console.log('Initializing push notification listeners...');
    
    // Register with FCM
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
    });
    
    // Handle registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });
    
    // Handle push notification received
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });
    
    // Handle when user taps on notification
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push notification action performed:', action);
    });
    
    console.log('Push notification listeners registered');
  } catch (error) {
    console.error('Error initializing push notification listeners:', error);
  }
};
