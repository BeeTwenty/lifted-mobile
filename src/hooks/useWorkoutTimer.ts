import { useState, useEffect, useRef } from "react";
import { scheduleRestEndNotification, cancelNotification } from "@/services/NotificationService";

export const useWorkoutTimer = (initialRunningState = false) => {
  const [isRunning, setIsRunning] = useState(initialRunningState);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const restTimerRef = useRef<number | null>(null);
  const notificationIdRef = useRef<number | null>(null);

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
        scheduleRestEndNotification(restTimeRemaining).then(id => {
          if (id) notificationIdRef.current = id;
        });
      }

      restTimerRef.current = window.setInterval(() => {
        setRestTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (restTimerRef.current) {
              clearInterval(restTimerRef.current);
            }
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimerRef.current) {
      clearInterval(restTimerRef.current);
      
      // Cancel notification if rest timer was manually skipped or completed
      if (notificationIdRef.current !== null) {
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
        cancelNotification(notificationIdRef.current);
      }
    };
  }, [restTimeRemaining]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const startRestTimer = (duration: number) => {
    setRestTimeRemaining(duration);
  };

  const skipRestTimer = () => {
    setRestTimeRemaining(null);
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
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
