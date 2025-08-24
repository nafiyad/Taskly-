import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Monitor, Clock, User } from 'lucide-react';
import { AppSettings } from '../types';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (settings: AppSettings) => Promise<void>;
  setCurrentPage: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, setCurrentPage }) => {
  const [theme, setTheme] = useState(settings.theme);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [focusTime, setFocusTime] = useState(settings.focusTime);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update local state when settings prop changes
  useEffect(() => {
    setTheme(settings.theme);
    setNotifications(settings.notifications);
    setFocusTime(settings.focusTime);
    setShortBreak(settings.shortBreak);
    setLongBreak(settings.longBreak);
    setHasUnsavedChanges(false);
  }, [settings]);

  // Apply theme immediately when changed
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    // Apply theme immediately
    const tempSettings = {
      ...settings,
      theme: newTheme
    };
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Mark that we have unsaved changes
    setHasUnsavedChanges(
      newTheme !== settings.theme ||
      notifications !== settings.notifications ||
      focusTime !== settings.focusTime ||
      shortBreak !== settings.shortBreak ||
      longBreak !== settings.longBreak
    );
  };

  // Check for unsaved changes when any setting changes
  useEffect(() => {
    setHasUnsavedChanges(
      theme !== settings.theme ||
      notifications !== settings.notifications ||
      focusTime !== settings.focusTime ||
      shortBreak !== settings.shortBreak ||
      longBreak !== settings.longBreak
    );
  }, [theme, notifications, focusTime, shortBreak, longBreak, settings]);

  const saveChanges = async () => {
    // Validate inputs
    if (focusTime < 1 || focusTime > 60) {
      toast.error('Focus time must be between 1 and 60 minutes');
      return;
    }
    
    if (shortBreak < 1 || shortBreak > 30) {
      toast.error('Short break must be between 1 and 30 minutes');
      return;
    }
    
    if (longBreak < 5 || longBreak > 60) {
      toast.error('Long break must be between 5 and 60 minutes');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newSettings: AppSettings = {
        theme,
        notifications,
        focusTime,
        shortBreak,
        longBreak
      };
      
      await updateSettings(newSettings);
      toast.success('Settings updated successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button className="text-blue-600 border-b-2 border-blue-600 py-4 px-6 font-medium dark:text-blue-400 dark:border-blue-400">
              General
            </button>
            <button 
              onClick={() => setCurrentPage('account')}
              className="text-gray-500 hover:text-gray-700 py-4 px-6 font-medium dark:text-gray-400 dark:hover:text-gray-300"
            >
              Account
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
                <Monitor className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Appearance
              </h3>
              <div className="ml-7 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Theme</label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Sun className="h-5 w-5 mr-2" />
                      Light
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Moon className="h-5 w-5 mr-2" />
                      Dark
                    </button>
                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`flex items-center justify-center p-3 rounded-lg border ${
                        theme === 'system'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-400'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Monitor className="h-5 w-5 mr-2" />
                      System
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notifications */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
                <Bell className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Notifications
              </h3>
              <div className="ml-7">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Enable notifications</span>
                </label>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                  Receive notifications for completed timers and task reminders
                </p>
              </div>
            </div>
            
            {/* Timer Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
                <Clock className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Timer Settings
              </h3>
              <div className="ml-7 space-y-4">
                <div>
                  <label htmlFor="focus-time" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Focus Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="focus-time"
                    min="1"
                    max="60"
                    value={focusTime}
                    onChange={(e) => setFocusTime(parseInt(e.target.value) || 25)}
                    className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="short-break" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    id="short-break"
                    min="1"
                    max="30"
                    value={shortBreak}
                    onChange={(e) => setShortBreak(parseInt(e.target.value) || 5)}
                    className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="long-break" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    id="long-break"
                    min="5"
                    max="60"
                    value={longBreak}
                    onChange={(e) => setLongBreak(parseInt(e.target.value) || 15)}
                    className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Account Settings Link */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
                <User className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Account Settings
              </h3>
              <div className="ml-7">
                <button
                  onClick={() => setCurrentPage('account')}
                  className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Manage your account →
                </button>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                  Change your password, update email, or manage account security
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={saveChanges}
                disabled={isSaving || !hasUnsavedChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              {hasUnsavedChanges && (
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                  You have unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;