
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativePlatform, logPlatformInfo } from './utils/platformUtils';
import { Capacitor } from '@capacitor/core';

/**
 * Check if notifications are supported and permissions are granted
 * @returns Promise<boolean> indicating if notifications are supported and permissions are granted
 */
export const checkNotificationsSupport = async (): Promise<boolean> => {
  try {
    // Check if running on a native platform
    if (!isNativePlatform()) {
      console.log('checkNotificationsSupport: Not on native platform');
      return false;
    }

    console.log('Checking notification permissions...');
    logPlatformInfo();
    
    // First check existing permissions
    const permissionCheck = await LocalNotifications.checkPermissions();
    console.log('Current permission status:', permissionCheck);
    
    if (permissionCheck.display === 'granted') {
      console.log('Notification permissions already granted');
      return true;
    }
    
    // If not granted, request permissions
    console.log('Requesting notification permissions...');
    try {
      const requestResult = await LocalNotifications.requestPermissions();
      console.log('Requested permission result:', requestResult);
      
      if (requestResult.display === 'granted') {
        console.log('Permission granted after request');
        return true;
      } else {
        console.log('Permission denied after request');
        return false;
      }
    } catch (requestError) {
      console.error('Error requesting permissions:', requestError);
      
      // Try alternative request method for Android if first method fails
      if (Capacitor.getPlatform() === 'android') {
        try {
          console.log('Trying alternative method to request permissions on Android');
          // Use basic notification to trigger permission request
          await LocalNotifications.schedule({
            notifications: [{
              id: 999999,
              title: 'Permission Request',
              body: 'Please grant notification permissions',
              schedule: { at: new Date(Date.now() + 1000) }
            }]
          });
          
          // Check permissions again after alternative request
          const recheckResult = await LocalNotifications.checkPermissions();
          console.log('Rechecked permissions after alternative method:', recheckResult);
          return recheckResult.display === 'granted';
        } catch (alternativeError) {
          console.error('Alternative permission request failed:', alternativeError);
        }
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};
