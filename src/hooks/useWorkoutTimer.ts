
import { useState, useEffect, useRef } from "react";
import { 
  scheduleRestEndNotification, 
  cancelNotification, 
  initializeNotifications 
} from "@/services/notifications";
import { Capacitor } from '@capacitor/core';

export const useWorkoutTimer = (initialRunningState = false) => {
  const [isRunning, setIsRunning] = useState(initialRunningState);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const restTimerRef = useRef<number | null>(null);
  const notificationIdRef = useRef<number | null>(null);
  
  // Store the timestamp when the timer was started/paused to account for background time
  const lastTimestampRef = useRef<number>(Date.now());
  const restStartTimestampRef = useRef<number | null>(null);

  // Initialize notifications when hook is first used
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Background-aware timer for workout
  useEffect(() => {
    if (isRunning) {
      lastTimestampRef.current = Date.now();
      
      const updateTimer = () => {
        const now = Date.now();
        const delta = Math.floor((now - lastTimestampRef.current) / 1000);
        
        if (delta >= 1) {
          setElapsedTime(prev => prev + delta);
          lastTimestampRef.current = now;
        }
        
        timerRef.current = window.setTimeout(updateTimer, 1000);
      };
      
      timerRef.current = window.setTimeout(updateTimer, 1000);
    } else if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning]);

  // Background-aware timer for rest periods
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
        
        // Set the start timestamp for the rest period
        restStartTimestampRef.current = Date.now();
      }

      const updateRestTimer = () => {
        if (restStartTimestampRef.current === null) {
          restStartTimestampRef.current = Date.now();
        }
        
        const now = Date.now();
        const elapsedRestTime = Math.floor((now - restStartTimestampRef.current) / 1000);
        const newRestTimeRemaining = Math.max(0, restTimeRemaining - elapsedRestTime);
        
        setRestTimeRemaining(newRestTimeRemaining);
        
        if (newRestTimeRemaining <= 0) {
          if (restTimerRef.current) {
            clearTimeout(restTimerRef.current);
          }
          
          // Play sound when timer completes
          playTimerCompletionSound();
          
          // Reset the rest timer
          setRestTimeRemaining(null);
          restStartTimestampRef.current = null;
        } else {
          restTimerRef.current = window.setTimeout(updateRestTimer, 1000);
        }
      };
      
      restTimerRef.current = window.setTimeout(updateRestTimer, 1000);
    } else if (restTimerRef.current) {
      clearTimeout(restTimerRef.current);
      
      // Cancel notification if rest timer was manually skipped or completed
      if (notificationIdRef.current !== null) {
        console.log(`Cancelling notification with ID: ${notificationIdRef.current}`);
        cancelNotification(notificationIdRef.current);
        notificationIdRef.current = null;
      }
      
      // Reset the rest timer start timestamp
      restStartTimestampRef.current = null;
    }

    return () => {
      if (restTimerRef.current) {
        clearTimeout(restTimerRef.current);
      }
      
      // Clean up notification when component unmounts
      if (notificationIdRef.current !== null) {
        console.log(`Cleaning up notification with ID: ${notificationIdRef.current}`);
        cancelNotification(notificationIdRef.current);
      }
    };
  }, [restTimeRemaining]);

  // Register visibility change listener to handle app going to background/foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('App came to foreground, updating timers');
        
        // Update workout timer if it's running
        if (isRunning) {
          const now = Date.now();
          const delta = Math.floor((now - lastTimestampRef.current) / 1000);
          if (delta > 0) {
            setElapsedTime(prev => prev + delta);
            lastTimestampRef.current = now;
          }
        }
        
        // Update rest timer if it's running
        if (restTimeRemaining !== null && restTimeRemaining > 0 && restStartTimestampRef.current !== null) {
          const now = Date.now();
          const elapsedRestTime = Math.floor((now - restStartTimestampRef.current) / 1000);
          const newRestTimeRemaining = Math.max(0, restTimeRemaining - elapsedRestTime);
          
          if (newRestTimeRemaining <= 0) {
            setRestTimeRemaining(null);
            restStartTimestampRef.current = null;
            playTimerCompletionSound();
          } else {
            setRestTimeRemaining(newRestTimeRemaining);
          }
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, restTimeRemaining]);

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
    if (!isRunning) {
      // If starting the timer, update the last timestamp
      lastTimestampRef.current = Date.now();
    }
    setIsRunning(!isRunning);
  };

  const startRestTimer = (duration: number) => {
    console.log(`Starting rest timer for ${duration} seconds`);
    restStartTimestampRef.current = Date.now();
    setRestTimeRemaining(duration);
  };

  const skipRestTimer = () => {
    console.log('Skipping rest timer');
    setRestTimeRemaining(null);
    restStartTimestampRef.current = null;
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
