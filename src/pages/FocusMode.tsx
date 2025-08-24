import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX, Lightbulb, Lock } from 'lucide-react';
import { AppSettings, TimerState, UserSubscription } from '../types';
import TimerDisplay from '../components/TimerDisplay';
import { generateFocusTip } from '../lib/deepseek';
import ProBadge from '../components/ProBadge';
import { getFeatureLimit } from '../lib/featureLimits';

interface FocusModeProps {
  settings: AppSettings;
  completeFocusSession: () => void;
  timerState: TimerState;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchTimerMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  toggleSound: () => void;
  subscription: UserSubscription;
}

const FocusMode: React.FC<FocusModeProps> = ({ 
  settings, 
  timerState,
  toggleTimer,
  resetTimer,
  switchTimerMode,
  toggleSound,
  subscription
}) => {
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [focusTip, setFocusTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPro = subscription.plan === 'pro';
  const focusSessionLimit = getFeatureLimit(subscription.plan, 'focusSessions') as number;
  const isAtFocusLimit = !isPro && timerState.sessionCount >= focusSessionLimit;

  // Using more reliable audio sources
  const soundOptions = [
    { id: 'rain', name: 'Rain', url: 'https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3' },
    { id: 'forest', name: 'Forest', url: 'https://cdn.freesound.org/previews/573/573577_5674468-lq.mp3' },
    { id: 'cafe', name: 'Cafe', url: 'https://cdn.freesound.org/previews/323/323683_5260872-lq.mp3' },
    { id: 'whitenoise', name: 'White Noise', url: 'https://cdn.freesound.org/previews/133/133099_2398403-lq.mp3' },
  ];

  useEffect(() => {
    // Load a focus tip when the component mounts
    loadFocusTip();
    
    // Clean up audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (ambientSound) {
      const soundOption = soundOptions.find(option => option.id === ambientSound);
      if (soundOption) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audio = new Audio(soundOption.url);
        audio.loop = true;
        audio.volume = isMuted ? 0 : volume / 100;
        
        // Preload the audio
        audio.preload = 'auto';
        
        // Add event listeners for better error handling
        audio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          setAmbientSound(null);
        });
        
        // Play when ready
        audio.addEventListener('canplaythrough', () => {
          audio.play().catch(error => {
            console.error('Error playing audio:', error);
            // Show a user-friendly message
            if (error.name === 'NotAllowedError') {
              alert('Please interact with the page first to enable audio playback.');
            }
          });
        });
        
        audioRef.current = audio;
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [ambientSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const loadFocusTip = async () => {
    setLoadingTip(true);
    try {
      const tip = await generateFocusTip();
      setFocusTip(tip);
    } catch (error) {
      console.error('Error loading focus tip:', error);
      setFocusTip('Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.');
    } finally {
      setLoadingTip(false);
    }
  };

  const toggleAmbientSound = (soundId: string) => {
    if (ambientSound === soundId) {
      setAmbientSound(null);
    } else {
      setAmbientSound(soundId);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Focus Mode</h1>
        {isPro && <ProBadge />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <TimerDisplay 
            timerState={timerState}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            switchTimerMode={switchTimerMode}
            toggleSound={toggleSound}
            isAtLimit={isAtFocusLimit}
          />
          
          {isAtFocusLimit && (
            <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between dark:bg-blue-900/20 dark:border-blue-800/30">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-blue-500 mr-2 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">
                  You've reached the limit of {focusSessionLimit} focus sessions on the Free plan.
                </span>
              </div>
              <button
                onClick={() => window.location.hash = 'subscription'}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Upgrade
              </button>
            </div>
          )}
          
          {/* AI Focus Tip */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center dark:text-white">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                AI Focus Tip
              </h2>
              <button 
                onClick={loadFocusTip}
                disabled={loadingTip || !isPro}
                className={`text-blue-600 hover:text-blue-800 text-sm dark:text-blue-400 dark:hover:text-blue-300 ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingTip ? 'Loading...' : 'New Tip'}
              </button>
            </div>
            <div className="text-gray-700 dark:text-gray-300 italic">
              {loadingTip ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                  <span>Loading tip...</span>
                </div>
              ) : (
                focusTip
              )}
            </div>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-right">
              {isPro ? 'Powered by Advanced AI' : 'Upgrade to Pro for personalized tips'}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center dark:text-white">
                <Music className="h-5 w-5 mr-2" />
                Ambient Sounds
              </h2>
              {!isPro && <span className="text-xs text-gray-500 dark:text-gray-400">Pro Feature</span>}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={toggleMute}
                  disabled={!isPro}
                  className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={`w-full mx-3 ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isMuted || !isPro}
                  aria-label="Volume control"
                />
                <span className="text-sm text-gray-600 w-8 text-right dark:text-gray-300">{volume}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {soundOptions.map(sound => (
                <button
                  key={sound.id}
                  onClick={() => isPro && toggleAmbientSound(sound.id)}
                  disabled={!isPro}
                  className={`p-4 rounded-lg border ${
                    ambientSound === sound.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                  } transition-colors duration-200 ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-pressed={ambientSound === sound.id}
                >
                  {sound.name}
                </button>
              ))}
            </div>
            
            {!isPro && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => window.location.hash = 'subscription'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Focus Tips</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-900 dark:text-blue-300">1</span>
                Remove distractions from your environment
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-900 dark:text-blue-300">2</span>
                Break your work into {settings.focusTime}-minute focused sessions
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-900 dark:text-blue-300">3</span>
                Take short {settings.shortBreak}-minute breaks between sessions
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-900 dark:text-blue-300">4</span>
                After 4 sessions, take a longer {settings.longBreak}-minute break
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;