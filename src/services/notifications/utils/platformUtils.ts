
import { Capacitor } from '@capacitor/core';

/**
 * Check if the app is running on a native platform (not in browser)
 * @returns boolean indicating if the app is running on a native platform
 */
export const isNativePlatform = (): boolean => {
  const isNative = Capacitor.isNativePlatform();
  console.log(`Platform check - isNativePlatform: ${isNative}`);
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
  const platform = Capacitor.getPlatform();
  console.log(`Current platform: ${platform}`);
  return platform;
};

/**
 * Check if the current platform is Android
 * @returns boolean indicating if the platform is Android
 */
export const isAndroidPlatform = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Check if the current platform is iOS
 * @returns boolean indicating if the platform is iOS
 */
export const isIOSPlatform = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Log platform and environment information for debugging
 */
export const logPlatformInfo = (): void => {
  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  const webViewVersion = Capacitor.getPlatform() === 'android' ? 
    (window as any).navigator.userAgent : 'Not available';
  
  console.group('Platform Information');
  console.log(`Platform: ${platform}`);
  console.log(`Is Native: ${isNative}`);
  console.log(`User Agent: ${navigator.userAgent}`);
  console.log(`WebView Info: ${webViewVersion}`);
  console.groupEnd();
};
