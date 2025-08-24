import React, { useState } from 'react';
import { Menu, X, User, LogOut, Settings, Clock, Play, Pause, UserCog, Zap } from 'lucide-react';
import { UserStats, TimerState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ProBadge from './ProBadge';

interface HeaderProps {
  toggleSidebar: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userStats: UserStats;
  isDarkMode: boolean;
  timerState: TimerState;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  currentPage, 
  setCurrentPage,
  userStats,
  isDarkMode,
  timerState
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { signOut, subscription } = useAuth();
  const isPro = subscription.plan === 'pro';

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm z-10 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:text-white"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 flex items-center">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Taskly</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">by <span className="font-cursive italic">Nafiyad</span></span>
                {isPro && <ProBadge className="ml-2" />}
              </div>
            </div>
          </div>

          {/* Timer Status (if active) */}
          {timerState.isActive && (
            <div className="hidden md:flex items-center">
              <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center dark:bg-blue-900/30">
                <Clock className="h-4 w-4 text-blue-600 mr-2 dark:text-blue-400" />
                <span className="text-blue-700 font-medium dark:text-blue-300">
                  {timerState.timerMode === 'focus' ? 'Focus' : timerState.timerMode === 'shortBreak' ? 'Break' : 'Long Break'}:
                </span>
                <span className="text-blue-700 font-medium ml-1 dark:text-blue-300">
                  {String(timerState.minutes).padStart(2, '0')}:{String(timerState.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          {/* User Info and Profile Dropdown */}
          <div className="flex items-center">
            <div className="mr-4 hidden md:flex items-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Level {userStats.level}</span>
                <span className="mx-1">•</span>
                <span>{userStats.points} XP</span>
                {!isPro && (
                  <>
                    <span className="mx-1">•</span>
                    <button 
                      onClick={() => setCurrentPage('subscription')}
                      className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Upgrade
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                aria-label="User menu"
              >
                <User className="h-6 w-6" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 dark:bg-gray-800 dark:border dark:border-gray-700">
                  <button 
                    onClick={() => {
                      setCurrentPage('profile');
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <User className="inline-block h-4 w-4 mr-2" />
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('account');
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <UserCog className="inline-block h-4 w-4 mr-2" />
                    Account Settings
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('subscription');
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Zap className="inline-block h-4 w-4 mr-2" />
                    Subscription
                    {isPro && <ProBadge size="sm" className="ml-2" />}
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('settings');
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="inline-block h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <LogOut className="inline-block h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;