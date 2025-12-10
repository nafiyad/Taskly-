import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerState, AppSettings } from '../types';

interface UseTimerProps {
  settings: AppSettings;
  completeFocusSession: () => void;
}

export const useTimer = ({ settings, completeFocusSession }: UseTimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>(() => {
    const savedTimerState = localStorage.getItem('timerState');
    return savedTimerState ? JSON.parse(savedTimerState) : {
      minutes: settings?.focusTime || 25,
      seconds: 0,
      isActive: false,
      timerMode: 'focus',
      sessionCount: 0,
      soundOn: settings?.notifications || true
    };
  });
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Preload audio for better performance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio('https://assets.coderrocketfuel.com/pomodoro-times-up.mp3');
    audioRef.current.preload = 'auto';
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save timer state to localStorage
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [timerState]);

  // Update timer settings when app settings change
  useEffect(() => {
    if (settings && !timerState.isActive) {
      setTimerState(prev => ({
        ...prev,
        soundOn: settings.notifications
      }));
    }
  }, [settings, timerState.isActive]);

  // Timer logic with useCallback for stable reference
  const handleTimerTick = useCallback(() => {
    setTimerState(prevState => {
      if (prevState.seconds === 0) {
        if (prevState.minutes === 0) {
          // Timer completed
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          
          // Play sound if enabled
          if (prevState.soundOn && audioRef.current) {
            try {
              audioRef.current.currentTime = 0; // Reset audio to start
              audioRef.current.play().catch(error => {
                console.error("Error playing audio:", error);
              });
            } catch (error) {
              console.error("Error playing audio:", error);
            }
          }
          
          // Increment session count if focus mode completed
          if (prevState.timerMode === 'focus') {
            completeFocusSession();
            
            // After 4 focus sessions, take a long break
            if ((prevState.sessionCount + 1) % 4 === 0) {
              return {
                ...prevState,
                isActive: false,
                minutes: settings.longBreak,
                seconds: 0,
                timerMode: 'longBreak',
                sessionCount: prevState.sessionCount + 1
              };
            } else {
              return {
                ...prevState,
                isActive: false,
                minutes: settings.shortBreak,
                seconds: 0,
                timerMode: 'shortBreak',
                sessionCount: prevState.sessionCount + 1
              };
            }
          } else {
            return {
              ...prevState,
              isActive: false,
              minutes: settings.focusTime,
              seconds: 0,
              timerMode: 'focus'
            };
          }
        } else {
          return {
            ...prevState,
            minutes: prevState.minutes - 1,
            seconds: 59
          };
        }
      } else {
        return {
          ...prevState,
          seconds: prevState.seconds - 1
        };
      }
    });
  }, [settings.focusTime, settings.shortBreak, settings.longBreak, completeFocusSession]);

  useEffect(() => {
    if (timerState.isActive) {
      timerIntervalRef.current = setInterval(handleTimerTick, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerState.isActive, handleTimerTick]);

  const toggleTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(prev => {
      let minutes;
      if (prev.timerMode === 'focus') {
        minutes = settings.focusTime;
      } else if (prev.timerMode === 'shortBreak') {
        minutes = settings.shortBreak;
      } else {
        minutes = settings.longBreak;
      }
      
      return {
        ...prev,
        isActive: false,
        minutes,
        seconds: 0
      };
    });
  }, [settings.focusTime, settings.shortBreak, settings.longBreak]);

  const switchTimerMode = useCallback((mode: 'focus' | 'shortBreak' | 'longBreak') => {
    let minutes;
    if (mode === 'focus') {
      minutes = settings.focusTime;
    } else if (mode === 'shortBreak') {
      minutes = settings.shortBreak;
    } else {
      minutes = settings.longBreak;
    }
    
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      timerMode: mode,
      minutes,
      seconds: 0
    }));
  }, [settings.focusTime, settings.shortBreak, settings.longBreak]);

  const toggleSound = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      soundOn: !prev.soundOn
    }));
  }, []);

  return {
    timerState,
    toggleTimer,
    resetTimer,
    switchTimerMode,
    toggleSound
  };
};
