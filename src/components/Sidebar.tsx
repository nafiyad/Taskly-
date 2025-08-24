import React from 'react';
import { Home, CheckSquare, Calendar, Clock, Settings, Award, User, MessageCircle, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProBadge from './ProBadge';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, setCurrentPage }) => {
  const { subscription } = useAuth();
  const isPro = subscription.plan === 'pro';
  
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Home className="h-5  w-5" /> },
    { id: 'habits', name: 'Habits', icon: <Calendar className="h-5 w-5" /> },
    { id: 'focus', name: 'Focus Mode', icon: <Clock className="h-5 w-5" /> },
    { id: 'chat', name: 'Chat Assistant', icon: <MessageCircle className="h-5 w-5" />, pro: true },
    { id: 'achievements', name: 'Achievements', icon: <Trophy className="h-5 w-5" /> },
    { id: 'profile', name: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'subscription', name: 'Subscription', icon: <Zap className="h-5 w-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <aside
      className={`bg-white shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-r dark:border-gray-700 ${
        isOpen ? 'w-64' : 'w-0 md:w-20'
      } flex flex-col`}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-4">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
              {isPro && <ProBadge size="sm" />}
            </div>
          ) : (
            <div className="h-8 flex justify-center">
              {isPro && <ProBadge size="sm" />}
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="px-2 mb-1">
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-md ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  } transition-colors duration-200 ${item.pro && !isPro ? 'opacity-50' : ''}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isOpen && (
                    <div className="ml-3 flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      {item.pro && !isPro && (
                        <ProBadge size="sm" />
                      )}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;