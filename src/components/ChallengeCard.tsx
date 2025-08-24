import React from 'react';
import { Trophy, Calendar, Clock, Target, Award } from 'lucide-react';
import { Challenge } from '../types';
import ProgressBar from './ProgressBar';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (id: number) => void;
  onClaim?: (id: number) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin, onClaim }) => {
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const today = new Date();
  
  const isActive = today >= startDate && today <= endDate;
  const isUpcoming = today < startDate;
  const isExpired = today > endDate;
  
  const progress = Math.min(Math.round((challenge.progress / challenge.goal) * 100), 100);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-200 ${challenge.completed ? 'border-2 border-green-500 dark:border-green-400' : isActive ? 'border-2 border-blue-500 dark:border-blue-400' : ''} dark:bg-gray-800`}>
      <div className="flex items-start">
        <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${
          isUpcoming ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
          isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
          challenge.completed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
          'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
        }`}>
          <Target className="h-6 w-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{challenge.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{challenge.description}</p>
            </div>
            
            {isActive && !challenge.completed && onJoin && (
              <button 
                onClick={() => onJoin(challenge.id)}
                className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Join Challenge
              </button>
            )}
            
            {challenge.completed && onClaim && (
              <button 
                onClick={() => onClaim(challenge.id)}
                className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors duration-200"
              >
                Claim +{challenge.reward} XP
              </button>
            )}
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1 dark:text-gray-400">
              <span>Progress</span>
              <span>{challenge.progress}/{challenge.goal}</span>
            </div>
            <ProgressBar 
              progress={progress} 
              color={challenge.completed ? 'green' : isActive ? 'blue' : isUpcoming ? 'gray' : 'red'} 
              height={4} 
            />
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center dark:bg-gray-700 dark:text-gray-300">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
              
              {isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 flex items-center dark:bg-blue-900 dark:text-blue-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {daysLeft} days left
                </span>
              )}
              
              {isUpcoming && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center dark:bg-gray-700 dark:text-gray-300">
                  Upcoming
                </span>
              )}
              
              {isExpired && !challenge.completed && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center dark:bg-red-900 dark:text-red-300">
                  Expired
                </span>
              )}
            </div>
            
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center">
              <Trophy className="h-3 w-3 mr-1" />
              {challenge.reward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;