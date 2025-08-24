import React from 'react';
import { Zap, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UpgradePromptProps {
  feature: string;
  onClose: () => void;
  onUpgrade: () => void;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, onClose, onUpgrade }) => {
  const { subscription } = useAuth();
  
  // Don't show for pro users
  if (subscription.plan === 'pro') {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in dark:bg-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">Upgrade to Pro</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {feature} is a Pro feature. Upgrade to Taskly Pro to unlock unlimited access to all premium features.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 dark:bg-gray-700">
          <h3 className="font-medium text-gray-800 mb-3 dark:text-white">Pro Features Include:</h3>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <Zap className="h-4 w-4 text-blue-500 mr-2" />
              <span>Unlimited tasks and habits</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <Zap className="h-4 w-4 text-blue-500 mr-2" />
              <span>Advanced AI productivity insights</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <Zap className="h-4 w-4 text-blue-500 mr-2" />
              <span>Custom themes and advanced focus tools</span>
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <Zap className="h-4 w-4 text-blue-500 mr-2" />
              <span>Data export and priority support</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Upgrade to Pro
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;