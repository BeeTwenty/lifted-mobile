
/**
 * @deprecated This file is being kept for backward compatibility.
 * Please import from src/services/notifications directly instead.
 * 
 * This file has been refactored into smaller modules for better maintainability.
 */

export {
  checkNotificationsSupport,
  scheduleRestEndNotification,
  cancelNotification,
  sendTestNotification,
  registerNotificationChannel,
  initializeNotifications,
} from './notifications';
