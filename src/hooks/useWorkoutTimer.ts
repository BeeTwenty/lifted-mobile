
import { useState, useEffect, useRef } from "react";
import { 
  scheduleRestEndNotification, 
  cancelNotification, 
  initializeNotifications 
} from "@/services/NotificationService";
import { Capacitor } from '@capacitor/core';

export const useWorkoutTimer = (initialRunningState = false) => {
  const [isRunning, setIsRunning] = useState(initialRunningState);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const restTimerRef = useRef<number | null>(null);
  const notificationIdRef = useRef<number | null>(null);

  // Initialize notifications when hook is first used
  useEffect(() => {
    initializeNotifications();
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (restTimeRemaining !== null && restTimeRemaining > 0) {
      // Schedule notification when rest timer starts
      if (restTimeRemaining && notificationIdRef.current === null) {
        console.log(`Scheduling notification for rest timer: ${restTimeRemaining} seconds`);
        scheduleRestEndNotification(restTimeRemaining).then(id => {
          if (id) {
            console.log(`Notification scheduled with ID: ${id}`);
            notificationIdRef.current = id;
          } else {
            console.log('Failed to schedule notification');
          }
        });
      }

      restTimerRef.current = window.setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (restTimerRef.current) {
              clearInterval(restTimerRef.current);
            }
            
            // Play sound when timer completes - try both ways
            playTimerCompletionSound();
            
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      
      // Cancel notification if rest timer was manually skipped or completed
      if (notificationIdRef.current !== null) {
        console.log(`Cancelling notification with ID: ${notificationIdRef.current}`);
        cancelNotification(notificationIdRef.current);
        notificationIdRef.current = null;
      }
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
      
      // Clean up notification when component unmounts
      if (notificationIdRef.current !== null) {
        console.log(`Cleaning up notification with ID: ${notificationIdRef.current}`);
        cancelNotification(notificationIdRef.current);
      }
    };
  }, [restTimeRemaining]);

  // Helper function to play sound when timer completes
  const playTimerCompletionSound = () => {
    try {
      // Only play in-app sound if we're not using native notifications
      // or if we're in the browser
      if (!Capacitor.isNativePlatform()) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (error) {
      console.error('Error playing timer completion sound:', error);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const startRestTimer = (duration: number) => {
    console.log(`Starting rest timer for ${duration} seconds`);
    setRestTimeRemaining(duration);
  };

  const skipRestTimer = () => {
    console.log('Skipping rest timer');
    setRestTimeRemaining(null);
    playTimerCompletionSound();
  };

  return {
    isRunning,
    elapsedTime,
    restTimeRemaining,
    toggleTimer,
    startRestTimer,
    skipRestTimer,
    setElapsedTime
  };
};
