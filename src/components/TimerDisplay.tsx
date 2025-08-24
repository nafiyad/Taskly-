import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Lock } from 'lucide-react';
import { TimerState } from '../types';

interface TimerDisplayProps {
  timerState: TimerState;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchTimerMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  toggleSound: () => void;
  isAtLimit?: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timerState,
  toggleTimer,
  resetTimer,
  switchTimerMode,
  toggleSound,
  isAtLimit = false
}) => {
  const { minutes, seconds, isActive, timerMode, sessionCount, soundOn } = timerState;

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
          onClick={() => switchTimerMode('focus')}
          disabled={isAtLimit}
          className={`px-4 py-2 rounded-md ${
            timerMode === 'focus'
              ? 'bg-blue-600 text-white dark:bg-blue-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Focus
        </button>
        <button
          onClick={() => switchTimerMode('shortBreak')}
          disabled={isAtLimit}
          className={`px-4 py-2 rounded-md ${
            timerMode === 'shortBreak'
              ? 'bg-green-600 text-white dark:bg-green-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchTimerMode('longBreak')}
          disabled={isAtLimit}
          className={`px-4 py-2 rounded-md ${
            timerMode === 'longBreak'
              ? 'bg-purple-600 text-white dark:bg-purple-700'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Long Break
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          disabled={isAtLimit}
          className={`p-3 rounded-full ${
            isActive ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          } text-white ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isAtLimit ? (
            <Lock className="h-6 w-6" />
          ) : isActive ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </button>
        <button
          onClick={resetTimer}
          disabled={isAtLimit}
          className={`p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Reset timer"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
        <button
          onClick={toggleSound}
          disabled={isAtLimit}
          className={`p-3 rounded-full ${
            soundOn ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          } ${soundOn ? 'text-white' : 'text-gray-800 dark:text-gray-200'} ${isAtLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
        >
          {soundOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;