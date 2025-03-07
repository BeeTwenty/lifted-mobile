
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { isNativePlatform, isAndroidPlatform } from './utils/platformUtils';
import { getRandomMessage } from './utils/notificationMessages';
import { registerNotificationChannel } from './notificationChannels';

/**
 * Send a test notification to verify notifications are working
 * @returns Promise<boolean> indicating if the notification was sent successfully
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    // Check if running on a native platform
    if (!isNativePlatform()) {
      console.log('Not on native platform, cannot send test notification');
      return false;
    }

    console.log('Sending test notification...');
    
    // For Android, check and register with Firebase first
    if (isAndroidPlatform()) {
      try {
        console.log('Checking and registering for push notifications on Android...');
        
        // Check Firebase registration
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
        // Continue to send local notification as fallback
      }
    }
    
    // Create notification channel for Android
    if (isAndroidPlatform()) {
      await registerNotificationChannel();
    }
    
    // Check local notification permissions
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
    
    // Send a test notification that appears immediately
    const notificationId = new Date().getTime();
    await LocalNotifications.schedule({
      notifications: [{
        id: notificationId,
        title: 'Test Notification',
        body: getRandomMessage(),
        // Schedule for 2 seconds from now
        schedule: { at: new Date(Date.now() + 2000) },
        // Android specific options
        ...(isAndroidPlatform() ? {
          channelId: 'workout-timer',
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#488AFF'
        } : {})
      }]
    });
    
    console.log(`Test notification scheduled with ID: ${notificationId}`);
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

// Initialize Push Notification listeners
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
