import React from 'react';
import { UserStats, Badge } from '../types';
import { Award, Trophy, Zap, CheckCircle, Clock } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

interface ProfileProps {
  userStats: UserStats;
}

const Profile: React.FC<ProfileProps> = ({ userStats }) => {
  // Calculate XP progress to next level
  const currentLevelPoints = (userStats.level - 1) * 100;
  const nextLevelPoints = userStats.level * 100;
  const progress = ((userStats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  // Get earned and unearned badges
  const earnedBadges = userStats.badges.filter(badge => badge.earned);
  const unearnedBadges = userStats.badges.filter(badge => !badge.earned);

  // Get icon component based on badge icon name
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'check-circle':
        return <CheckCircle className="h-8 w-8" />;
      case 'zap':
        return <Zap className="h-8 w-8" />;
      case 'award':
        return <Award className="h-8 w-8" />;
      case 'clock':
        return <Clock className="h-8 w-8" />;
      case 'star':
        return <Trophy className="h-8 w-8" />;
      default:
        return <Award className="h-8 w-8" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Your Profile</h1>
      
      {/* User Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-6 dark:bg-blue-900 dark:text-blue-300">
            <Trophy className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Level {userStats.level}</h2>
            <p className="text-gray-600 dark:text-gray-300">{userStats.points} total points</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Progress to Level {userStats.level + 1}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {userStats.points - currentLevelPoints}/{nextLevelPoints - currentLevelPoints} XP
            </span>
          </div>
          <ProgressBar progress={progress} color="blue" height={6} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 dark:text-green-400" />
              <span className="text-gray-700 font-medium dark:text-gray-200">Tasks Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">{userStats.tasksCompleted}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-600 mr-2 dark:text-purple-400" />
              <span className="text-gray-700 font-medium dark:text-gray-200">Focus Sessions</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">{userStats.focusSessionsCompleted}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2 dark:text-yellow-400" />
              <span className="text-gray-700 font-medium dark:text-gray-200">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">{userStats.longestStreak} days</p>
          </div>
        </div>
      </div>
      
      {/* Badges Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Your Badges</h2>
        
        {earnedBadges.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-700 mb-4 dark:text-gray-200">Earned Badges ({earnedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-2 dark:bg-yellow-900 dark:text-yellow-300">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center dark:text-gray-300">{badge.name}</span>
                  <span className="text-xs text-gray-500 text-center mt-1 dark:text-gray-400">{badge.description}</span>
                  {badge.earnedAt && (
                    <span className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center mb-6 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">You haven't earned any badges yet. Keep going!</p>
          </div>
        )}
        
        {unearnedBadges.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-700 mb-4 dark:text-gray-200">Badges to Earn ({unearnedBadges.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {unearnedBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mb-2 dark:bg-gray-700 dark:text-gray-500">
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center dark:text-gray-300">{badge.name}</span>
                  <span className="text-xs text-gray-500 text-center mt-1 dark:text-gray-400">{badge.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Achievements Timeline */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Your Journey</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
          <div className="relative border-l-2 border-blue-500 pl-8 pb-2 dark:border-blue-400">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0 dark:bg-blue-400"></div>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Started using TaskBuddy</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Began your productivity journey with TaskBuddy!</p>
            </div>
          </div>
          
          {earnedBadges.length > 0 && earnedBadges.map((badge, index) => (
            <div key={badge.id} className="relative border-l-2 border-blue-500 pl-8 pb-2 dark:border-blue-400">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-0 dark:bg-blue-400"></div>
              <div className={index === earnedBadges.length - 1 ? '' : 'mb-8'}>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Earned {badge.name} Badge</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Recently'}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{badge.description}</p>
              </div>
            </div>
          ))}
          
          {earnedBadges.length === 0 && (
            <div className="relative border-l-2 border-gray-300 pl-8 pb-2 dark:border-gray-600">
              <div className="absolute w-4 h-4 bg-gray-300 rounded-full -left-[9px] top-0 dark:bg-gray-600"></div>
              <div>
                <h3 className="text-lg font-medium text-gray-400 dark:text-gray-500">Earn your first badge</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">Coming soon</p>
                <p className="mt-2 text-gray-400 dark:text-gray-500">Complete tasks and build habits to earn badges!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;