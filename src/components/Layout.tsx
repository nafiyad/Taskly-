import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { AppSettings, UserStats, TimerState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  settings: AppSettings;
  userStats: UserStats;
  timerState: TimerState;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  setCurrentPage,
  settings,
  userStats,
  timerState
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      } else if (settings.theme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDarkMode(false);
        }
      }
    };

    handleThemeChange();

    // Listen for system theme changes if using system setting
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDarkMode(false);
        }
      };

      try {
        // Modern browsers
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } catch (e) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange as any);
        return () => mediaQuery.removeListener(handleChange as any);
      }
    }
  }, [settings.theme]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        toggleSidebar={toggleSidebar} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userStats={userStats}
        isDarkMode={isDarkMode}
        timerState={timerState}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};