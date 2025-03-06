
import { LocalNotifications } from '@capacitor/local-notifications';
import { isAndroidPlatform } from './utils/platformUtils';

/**
 * Register the notification channel for Android
 * @returns Promise<boolean> indicating if the channel was registered successfully
 */
export const registerNotificationChannel = async (): Promise<boolean> => {
  if (isAndroidPlatform()) {
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
