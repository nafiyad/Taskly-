import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import HabitTracker from './pages/HabitTracker';
import FocusMode from './pages/FocusMode';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AccountSettings from './pages/AccountSettings';
import ChatAssistant from './pages/ChatAssistant';
import Achievements from './pages/Achievements';
import Subscription from './pages/Subscription';
import { Task, Habit, UserStats, Badge, AppSettings, TimerState } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { Toaster } from 'react-hot-toast';
import AISuggestions from './components/AISuggestions';
import LevelUpModal from './components/LevelUpModal';
import UpgradePrompt from './components/UpgradePrompt';
import { hasReachedLimit, isFeatureAvailable } from './lib/featureLimits';
import { useTimer } from './hooks/useTimer';

function AppContent() {
  const { user, loading: authLoading, subscription } = useAuth();
  const { 
    tasks, 
    habits, 
    userStats, 
    settings, 
    loading: dataLoading,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    addHabit,
    toggleHabit,
    deleteHabit,
    completeFocusSession,
    updateSettings
  } = useData();
  
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const prevLevelRef = useRef<number | null>(null);

  // Use custom timer hook
  const { timerState, toggleTimer, resetTimer, switchTimerMode, toggleSound } = useTimer({
    settings,
    completeFocusSession
  });

  // Check for level up
  useEffect(() => {
    if (userStats && prevLevelRef.current && userStats.level > prevLevelRef.current) {
      setShowLevelUpModal(true);
      prevLevelRef.current = userStats.level;
    } else if (userStats && !prevLevelRef.current) {
      // Initialize the ref on first load without showing modal
      prevLevelRef.current = userStats.level;
    }
  }, [userStats.level]);

  // Feature limit checks
  const checkFeatureAccess = (feature: string, count: number = 0): boolean => {
    if (subscription.plan === 'pro') return true;
    
    switch (feature) {
      case 'tasks':
        if (hasReachedLimit('free', 'tasks', count)) {
          setUpgradeFeature('Task Management');
          setShowUpgradePrompt(true);
          return false;
        }
        return true;
      case 'habits':
        if (hasReachedLimit('free', 'habits', count)) {
          setUpgradeFeature('Habit Tracking');
          setShowUpgradePrompt(true);
          return false;
        }
        return true;
      case 'chat':
        if (!isFeatureAvailable('free', 'aiFeatures')) {
          setUpgradeFeature('AI Assistant');
          setShowUpgradePrompt(true);
          return false;
        }
        return true;
      case 'themes':
        if (!isFeatureAvailable('free', 'themes')) {
          setUpgradeFeature('Custom Themes');
          setShowUpgradePrompt(true);
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Wrapped add functions with feature checks - use useCallback
  const handleAddTask = useCallback((text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => {
    if (checkFeatureAccess('tasks', tasks.length)) {
      addTask(text, dueDate, priority, notes);
    }
  }, [tasks.length, subscription.plan, addTask]);

  const handleAddHabit = useCallback((name: string) => {
    if (checkFeatureAccess('habits', habits.length)) {
      addHabit(name);
    }
  }, [habits.length, subscription.plan, addHabit]);

  // If auth is loading, show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth page
  if (!user) {
    return <Auth />;
  }

  // If data is loading, show loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Check if we're on a policy page
  if (currentPage === 'privacy') {
    return <PrivacyPolicy setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'terms') {
    return <TermsOfService setCurrentPage={setCurrentPage} />;
  }

  // Check if we're on the account settings page
  if (currentPage === 'account') {
    return <AccountSettings setCurrentPage={setCurrentPage} />;
  }

  // Check if we're on the subscription page
  if (currentPage === 'subscription') {
    return <Subscription setCurrentPage={setCurrentPage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            tasks={tasks} 
            addTask={handleAddTask} 
            toggleTask={toggleTask} 
            deleteTask={deleteTask} 
            editTask={editTask}
            habits={habits}
            setCurrentPage={setCurrentPage}
            userStats={userStats}
            timerState={timerState}
            toggleTimer={toggleTimer}
            subscription={subscription}
          />
        );
      case 'habits':
        return (
          <HabitTracker 
            habits={habits} 
            addHabit={handleAddHabit} 
            toggleHabit={toggleHabit} 
            deleteHabit={deleteHabit}
            userStats={userStats}
            subscription={subscription}
          />
        );
      case 'focus':
        return (
          <FocusMode 
            settings={settings}
            completeFocusSession={completeFocusSession}
            timerState={timerState}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            switchTimerMode={switchTimerMode}
            toggleSound={toggleSound}
            subscription={subscription}
          />
        );
      case 'chat':
        if (!checkFeatureAccess('chat')) {
          setCurrentPage('dashboard');
          return null;
        }
        return (
          <ChatAssistant />
        );
      case 'settings':
        return (
          <Settings 
            settings={settings}
            updateSettings={updateSettings}
            setCurrentPage={setCurrentPage}
            subscription={subscription}
          />
        );
      case 'profile':
        return (
          <Profile 
            userStats={userStats}
            subscription={subscription}
          />
        );
      case 'achievements':
        return (
          <Achievements
            userStats={userStats}
            subscription={subscription}
          />
        );
      default:
        return (
          <Dashboard 
            tasks={tasks} 
            addTask={handleAddTask} 
            toggleTask={toggleTask} 
            deleteTask={deleteTask} 
            editTask={editTask}
            habits={habits}
            setCurrentPage={setCurrentPage}
            userStats={userStats}
            timerState={timerState}
            toggleTimer={toggleTimer}
            subscription={subscription}
          />
        );
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage}
      settings={settings}
      userStats={userStats}
      timerState={timerState}
    >
      {renderPage()}
      {subscription.plan === 'pro' && (
        <AISuggestions 
          tasks={tasks}
          habits={habits}
          addTask={handleAddTask}
          addHabit={handleAddHabit}
          currentPage={currentPage}
        />
      )}
      
      {showLevelUpModal && (
        <LevelUpModal 
          level={userStats.level} 
          onClose={() => setShowLevelUpModal(false)}
          rewards={{
            points: 50,
            badges: userStats.level >= 5 ? ['Productivity Guru'] : undefined
          }}
        />
      )}

      {showUpgradePrompt && (
        <UpgradePrompt 
          feature={upgradeFeature}
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={() => {
            setShowUpgradePrompt(false);
            setCurrentPage('subscription');
          }}
        />
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
        <Toaster position="top-right" />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;