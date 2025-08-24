import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PomodoroTimerProps {
  initialFocusTime?: number;
  initialShortBreak?: number;
  initialLongBreak?: number;
  notificationsEnabled?: boolean;
  onSessionComplete?: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  initialFocusTime = 25,
  initialShortBreak = 5,
  initialLongBreak = 15,
  notificationsEnabled = true,
  onSessionComplete
}) => {
  const [minutes, setMinutes] = useState(initialFocusTime);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [soundOn, setSoundOn] = useState(notificationsEnabled);
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval as NodeJS.Timeout);
            setIsActive(false);
            
            // Increment session count if focus mode completed
            if (timerMode === 'focus') {
              setSessionCount(prev => prev + 1);
              if (onSessionComplete) {
                onSessionComplete();
              }
            }
            
            // Play sound if enabled
            if (soundOn) {
              try {
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play().catch(error => {
                  console.error("Error playing audio:", error);
                });
              } catch (error) {
                console.error("Error playing audio:", error);
              }
            }
            
            // Switch modes
            if (timerMode === 'focus') {
              // After 4 focus sessions, take a long break
              if (sessionCount % 4 === 0) {
                setTimerMode('longBreak');
                setMinutes(initialLongBreak);
              } else {
                setTimerMode('shortBreak');
                setMinutes(initialShortBreak);
              }
            } else {
              setTimerMode('focus');
              setMinutes(initialFocusTime);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, soundOn, timerMode, initialFocusTime, initialShortBreak, initialLongBreak, sessionCount, onSessionComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (timerMode === 'focus') {
      setMinutes(initialFocusTime);
    } else if (timerMode === 'shortBreak') {
      setMinutes(initialShortBreak);
    } else {
      setMinutes(initialLongBreak);
    }
    setSeconds(0);
  };

  const toggleSound = () => {
    setSoundOn(!soundOn);
  };

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setTimerMode(mode);
    
    if (mode === 'focus') {
      setMinutes(initialFocusTime);
    } else if (mode === 'shortBreak') {
      setMinutes(initialShortBreak);
    } else {
      setMinutes(initialLongBreak);
    }
    setSeconds(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto dark:bg-gray-800">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">Pomodoro Timer</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {timerMode === 'focus' 
            ? 'Focus Time' 
            : timerMode === 'shortBreak' 
              ? 'Short Break' 
              : 'Long Break'}
        </p>
        {sessionCount > 0 && (
          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
            Sessions completed today: {sessionCount}
          </p>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => switchMode('focus')}
          className={`px-4 py-2 rounded-md ${
            timerMode === 'focus'
              ? 'bg-blue-600 text-white dark:bg-blue-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`px-4 py-2 rounded-md ${
            timerMode === 'shortBreak'
              ? 'bg-green-600 text-white dark:bg-green-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`px-4 py-2 rounded-md ${
            timerMode === 'longBreak'
              ? 'bg-purple-600 text-white dark:bg-purple-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Long Break
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className={`p-3 rounded-full ${
            isActive ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          } text-white`}
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
        <button
          onClick={toggleSound}
          className={`p-3 rounded-full ${
            soundOn ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          } ${soundOn ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        >
          {soundOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;