import React from 'react';
import { Sparkles, CheckCircle, Clock, Award } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface DailyQuestProps {
  title: string;
  description: string;
  reward: number;
  progress: number;
  goal: number;
  completed: boolean;
  expiresIn?: string;
  onClaim?: () => void;
}

const DailyQuest: React.FC<DailyQuestProps> = ({
  title,
  description,
  reward,
  progress,
  goal,
  completed,
  expiresIn,
  onClaim
}) => {
  const progressPercentage = Math.min(Math.round((progress / goal) * 100), 100);
  const canClaim = completed && onClaim;
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${completed ? 'border-2 border-green-500 dark:border-green-400' : ''} dark:bg-gray-800`}>
      <div className="flex items-start">
        <div className={`p-2 rounded-full mr-3 ${completed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
          <Sparkles className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
            </div>
            
            {canClaim && (
              <button
                onClick={onClaim}
                className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors duration-200"
              >
                Claim +{reward} XP
              </button>
            )}
            
            {completed && !canClaim && (
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded flex items-center dark:bg-gray-700 dark:text-gray-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Claimed
              </span>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1 dark:text-gray-400">
              <span>Progress</span>
              <span>{progress}/{goal}</span>
            </div>
            <ProgressBar 
              progress={progressPercentage} 
              color={completed ? 'green' : 'blue'} 
              height={4} 
            />
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            {expiresIn && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center dark:bg-gray-700 dark:text-gray-300">
                <Clock className="h-3 w-3 mr-1" />
                Expires in {expiresIn}
              </span>
            )}
            
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              {reward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuest;