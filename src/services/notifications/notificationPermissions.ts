
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativePlatform } from './utils/platformUtils';

/**
 * Check if notifications are supported and permissions are granted
 * @returns Promise<boolean> indicating if notifications are supported and permissions are granted
 */
export const checkNotificationsSupport = async (): Promise<boolean> => {
  try {
    // Check if running on a native platform
    if (!isNativePlatform()) {
      return false;
    }

    console.log('Checking notification permissions...');
    console.log('Platform:', await import('@capacitor/core').then(m => m.Capacitor.getPlatform()));
    
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
