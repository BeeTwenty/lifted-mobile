
import { Capacitor } from '@capacitor/core';

/**
 * Check if the app is running on a native platform (not in browser)
 * @returns boolean indicating if the app is running on a native platform
 */
export const isNativePlatform = (): boolean => {
  const isNative = Capacitor.isNativePlatform();
  if (!isNative) {
    console.log('Not running on native platform, skipping notifications');
  }
  return isNative;
};

/**
 * Get the current platform information
 * @returns The current platform name
 */
export const getCurrentPlatform = (): string => {
  return Capacitor.getPlatform();
};

/**
 * Check if the current platform is Android
 * @returns boolean indicating if the platform is Android
 */
export const isAndroidPlatform = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};
