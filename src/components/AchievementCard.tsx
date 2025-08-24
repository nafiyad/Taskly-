import React from 'react';
import { Award, CheckCircle, Clock, Star, Zap, Trophy } from 'lucide-react';
import { Achievement } from '../types';
import ProgressBar from './ProgressBar';

interface AchievementCardProps {
  achievement: Achievement;
  onClaim?: (id: number) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClaim }) => {
  const getIcon = () => {
    switch (achievement.icon) {
      case 'award':
        return <Award className="h-6 w-6" />;
      case 'check':
        return <CheckCircle className="h-6 w-6" />;
      case 'clock':
        return <Clock className="h-6 w-6" />;
      case 'star':
        return <Star className="h-6 w-6" />;
      case 'zap':
        return <Zap className="h-6 w-6" />;
      case 'trophy':
        return <Trophy className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  const getCategoryColor = () => {
    switch (achievement.category) {
      case 'daily':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'weekly':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'special':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      case 'milestone':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const progress = Math.min(Math.round((achievement.progress / achievement.maxProgress) * 100), 100);

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-200 ${achievement.completed ? 'border-2 border-green-500 dark:border-green-400' : 'hover:shadow-md'} dark:bg-gray-800`}>
      <div className="flex items-start">
        <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${getCategoryColor()}`}>
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{achievement.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
            </div>
            
            {achievement.completed && !achievement.completedAt && onClaim && (
              <button 
                onClick={() => onClaim(achievement.id)}
                className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors duration-200"
              >
                Claim +{achievement.reward} XP
              </button>
            )}
            
            {achievement.completedAt && (
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded dark:bg-gray-700 dark:text-gray-300">
                Claimed
              </span>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1 dark:text-gray-400">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <ProgressBar 
              progress={progress} 
              color={achievement.completed ? 'green' : 'blue'} 
              height={4} 
            />
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
            </span>
            
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              {achievement.reward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;