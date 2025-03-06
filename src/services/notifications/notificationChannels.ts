
import { LocalNotifications } from '@capacitor/local-notifications';
import { isAndroidPlatform } from './utils/platformUtils';

/**
 * Register the notification channel for Android
 * @returns Promise<boolean> indicating if the channel was registered successfully
 */
export const registerNotificationChannel = async (): Promise<boolean> => {
  if (!isAndroidPlatform()) {
    console.log('Channel registration skipped - not Android platform');
    return true; // Not Android, no channel needed
  }
  
  try {
    console.log('Creating notification channel for Android...');
    
    // First try to delete any existing channel to ensure clean state
    try {
      const channels = await LocalNotifications.listChannels();
      console.log('Existing channels:', channels);
      
      for (const channel of channels.channels) {
        if (channel.id === 'workout-timer') {
          console.log(`Deleting existing channel: ${channel.id}`);
          await LocalNotifications.deleteChannel({ id: channel.id });
        }
      }
    } catch (e) {
      console.warn('Error checking existing channels:', e);
    }
    
    // Create a new channel with high importance
    try {
      await LocalNotifications.createChannel({
        id: 'workout-timer',
        name: 'Workout Timer',
        description: 'Notifications for workout rest timers',
        importance: 5, // High importance for timers
        visibility: 1,  // Public visibility
        sound: 'default', // Use default sound
        vibration: true,
        lights: true,
        lightColor: '#FF0000' // Red light for visibility
      });
      
      console.log('Android notification channel created successfully');
    } catch (createError) {
      console.error('Error creating channel:', createError);
      
      // Fallback to simpler channel if the first attempt fails
      try {
        await LocalNotifications.createChannel({
          id: 'workout-timer',
          name: 'Workout Timer',
          description: 'Workout notifications',
          importance: 4
        });
        console.log('Simple fallback channel created');
      } catch (fallbackError) {
        console.error('Fallback channel creation failed:', fallbackError);
        return false;
      }
    }
    
    // Verify channel creation
    const channels = await LocalNotifications.listChannels();
    console.log('Available notification channels after creation:', channels);
    
    return channels.channels.some(channel => channel.id === 'workout-timer');
  } catch (error) {
    console.error('Error creating notification channel:', error);
    return false;
  }
};
