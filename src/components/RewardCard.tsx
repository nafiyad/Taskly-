import React from 'react';
import { Gift, Lock, Check, Star, Trophy, Award, Medal, Crown } from 'lucide-react';
import { Reward } from '../types';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  onClaim?: (id: number) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, userPoints, onClaim }) => {
  const canClaim = reward.unlocked && !reward.claimed && userPoints >= reward.cost;
  
  const getIcon = () => {
    switch (reward.icon) {
      case 'gift':
        return <Gift className="h-6 w-6" />;
      case 'star':
        return <Star className="h-6 w-6" />;
      case 'trophy':
        return <Trophy className="h-6 w-6" />;
      case 'award':
        return <Award className="h-6 w-6" />;
      case 'medal':
        return <Medal className="h-6 w-6" />;
      case 'crown':
        return <Crown className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 transition-all duration-200 ${
      reward.claimed ? 'border-2 border-green-500 dark:border-green-400' : 
      !reward.unlocked ? 'opacity-75' : 
      canClaim ? 'border-2 border-yellow-500 dark:border-yellow-400' : 
      'hover:shadow-md'
    } dark:bg-gray-800`}>
      <div className="flex items-start">
        <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${
          reward.claimed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
          !reward.unlocked ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {!reward.unlocked ? <Lock className="h-6 w-6" /> : getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">{reward.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{reward.description}</p>
            </div>
            
            {!reward.claimed && reward.unlocked && onClaim && (
              <button 
                onClick={() => onClaim(reward.id)}
                disabled={userPoints < reward.cost}
                className={`ml-2 px-2 py-1 text-white text-xs rounded transition-colors duration-200 ${
                  userPoints >= reward.cost 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Claim Reward
              </button>
            )}
            
            {reward.claimed && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded flex items-center dark:bg-green-900 dark:text-green-300">
                <Check className="h-3 w-3 mr-1" />
                Claimed
              </span>
            )}
          </div>
          
          <div className="mt-2 flex justify-between items-center">
            <div>
              {!reward.unlocked && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center dark:bg-gray-700 dark:text-gray-300">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </span>
              )}
            </div>
            
            <span className={`text-xs font-medium flex items-center ${
              userPoints >= reward.cost 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Star className="h-3 w-3 mr-1" />
              {reward.cost} points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;