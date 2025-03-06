
/**
 * This file is maintained for backward compatibility.
 * New code should import directly from the new modular notification services.
 */

import { 
  checkNotificationsSupport,
  scheduleRestEndNotification,
  cancelNotification,
  sendTestNotification,
  registerNotificationChannel,
  initializeNotifications
} from './notifications';

// Re-export all the notification functions for backward compatibility
export { 
  checkNotificationsSupport,
  scheduleRestEndNotification,
  cancelNotification,
  sendTestNotification,
  registerNotificationChannel,
  initializeNotifications
};

// Define helper function for use in components
export const checkAndInitNotifications = async (): Promise<boolean> => {
  console.log('Legacy notification service: initializing and checking notifications');
  await initializeNotifications();
  return await checkNotificationsSupport();
};
