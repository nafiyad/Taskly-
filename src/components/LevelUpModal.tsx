import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
  rewards?: {
    points?: number;
    badges?: string[];
  };
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose, rewards }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        setAnimationComplete(true);
        return;
      }
      
      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#FFD700', '#0066ff', '#FF4500', '#32CD32', '#9932CC'],
      });
    }, 200);
    
    return () => clearInterval(confettiInterval);
  }, []);

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
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900">
            <Trophy className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 dark:text-white">Level Up!</h2>
          <div className="flex items-center justify-center">
            <div className="bg-blue-100 text-blue-800 text-xl font-bold px-3 py-1 rounded-l-full dark:bg-blue-900 dark:text-blue-300">
              {level - 1}
            </div>
            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700">
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="bg-yellow-100 text-yellow-800 text-xl font-bold px-3 py-1 rounded-r-full dark:bg-yellow-900 dark:text-yellow-300">
              {level}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 dark:bg-gray-700">
          <h3 className="font-medium text-gray-800 mb-3 dark:text-white">Level {level} Rewards</h3>
          <ul className="space-y-2">
            {rewards?.points && (
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span>{rewards.points} bonus points</span>
              </li>
            )}
            {rewards?.badges && rewards.badges.map((badge, index) => (
              <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                <Award className="h-5 w-5 text-purple-500 mr-2" />
                <span>New badge: {badge}</span>
              </li>
            ))}
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <Trophy className="h-5 w-5 text-blue-500 mr-2" />
              <span>Increased daily point limits</span>
            </li>
          </ul>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4 dark:text-gray-400">
            Congratulations on reaching Level {level}! Keep up the great work and continue building productive habits.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;