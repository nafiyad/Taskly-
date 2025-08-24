import React, { useState } from 'react';
import { Trophy, Star, Award, Clock, Filter, CheckCircle, Target, Gift } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AchievementCard from '../components/AchievementCard';
import ChallengeCard from '../components/ChallengeCard';
import RewardCard from '../components/RewardCard';
import DailyQuest from '../components/DailyQuest';
import ProgressBar from '../components/ProgressBar';

interface AchievementsProps {
  userStats: any;
}

const Achievements: React.FC<AchievementsProps> = ({ userStats }) => {
  const { claimAchievement, joinChallenge, claimChallenge, claimReward } = useData();
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'rewards' | 'quests'>('achievements');
  const [filter, setFilter] = useState<'all' | 'completed' | 'inprogress' | 'locked'>('all');
  
  // Filter achievements based on selected filter
  const filteredAchievements = userStats.achievements.filter((achievement: any) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return achievement.completed;
    if (filter === 'inprogress') return !achievement.completed && achievement.progress > 0;
    if (filter === 'locked') return achievement.progress === 0;
    return true;
  });
  
  // Filter challenges based on selected filter
  const filteredChallenges = userStats.challenges.filter((challenge: any) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return challenge.completed;
    if (filter === 'inprogress') {
      const today = new Date();
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      return !challenge.completed && today >= startDate && today <= endDate;
    }
    if (filter === 'locked') {
      const today = new Date();
      const startDate = new Date(challenge.startDate);
      return today < startDate;
    }
    return true;
  });
  
  // Filter rewards based on selected filter
  const filteredRewards = userStats.rewards.filter((reward: any) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return reward.claimed;
    if (filter === 'inprogress') return reward.unlocked && !reward.claimed;
    if (filter === 'locked') return !reward.unlocked;
    return true;
  });
  
  // Mock daily quests
  const dailyQuests = [
    {
      id: 1,
      title: 'Complete 3 Tasks',
      description: 'Complete any 3 tasks today',
      reward: 30,
      progress: 1,
      goal: 3,
      completed: false,
      expiresIn: '23h 45m'
    },
    {
      id: 2,
      title: 'Maintain Habit Streak',
      description: 'Complete all your habits today',
      reward: 50,
      progress: 2,
      goal: 2,
      completed: true,
      expiresIn: '23h 45m'
    },
    {
      id: 3,
      title: 'Focus Session',
      description: 'Complete 1 focus session',
      reward: 25,
      progress: 0,
      goal: 1,
      completed: false,
      expiresIn: '23h 45m'
    }
  ];
  
  // Handle claiming an achievement
  const handleClaimAchievement = (id: number) => {
    claimAchievement(id);
  };
  
  // Handle joining a challenge
  const handleJoinChallenge = (id: number) => {
    joinChallenge(id);
  };
  
  // Handle claiming a challenge reward
  const handleClaimChallenge = (id: number) => {
    claimChallenge(id);
  };
  
  // Handle claiming a reward
  const handleClaimReward = (id: number) => {
    claimReward(id);
  };
  
  // Handle claiming a daily quest reward
  const handleClaimQuest = (id: number) => {
    // In a real app, this would update the database
    console.log(`Claimed quest ${id}`);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Achievements & Rewards</h1>
      
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Level {userStats.level}</h2>
              <div className="flex items-center">
                <span className="text-gray-600 dark:text-gray-300">{userStats.points} total points</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {userStats.experience}/{userStats.experienceToNextLevel} XP to next level
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Level {userStats.level}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Level {userStats.level + 1}</span>
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" 
                style={{ width: `${(userStats.experience / userStats.experienceToNextLevel) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 dark:text-green-400" />
              <span className="text-gray-700 font-medium dark:text-gray-200">Achievements</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">
              {userStats.achievements.filter((a: any) => a.completed).length}/{userStats.achievements.length}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2 dark:text-blue-400" />
              <span className="text-gray-700 font-medium dark:text-gray-200">Challenges</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">
              {userStats.challenges.filter((c: any) => c.completed).length}/{userStats.challenges.length}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-700">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-yellow-600 mr-2 dark:text-yellow-400" />
              <span className="text-gray-700 font-medium dark:text-gray-200">Rewards</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">
              {userStats.rewards.filter((r: any) => r.claimed).length}/{userStats.rewards.length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'achievements'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Award className="inline-block h-5 w-5 mr-1" />
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'challenges'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Trophy className="inline-block h-5 w-5 mr-1" />
              Challenges
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'rewards'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Star className="inline-block h-5 w-5 mr-1" />
              Rewards
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`px-4 py-3 font-medium ${
                activeTab === 'quests'
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Clock className="inline-block h-5 w-5 mr-1" />
              Daily Quests
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* Filter */}
          <div className="flex items-center mb-6">
            <Filter className="h-4 w-4 text-gray-500 mr-2 dark:text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="inprogress">In Progress</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement: any) => (
                  <AchievementCard 
                    key={achievement.id} 
                    achievement={achievement} 
                    onClaim={handleClaimAchievement}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No achievements found with the current filter.</p>
                  <button 
                    onClick={() => setFilter('all')}
                    className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Show all achievements
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'challenges' && (
            <div className="space-y-4">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge: any) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    onJoin={handleJoinChallenge}
                    onClaim={handleClaimChallenge}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No challenges found with the current filter.</p>
                  <button 
                    onClick={() => setFilter('all')}
                    className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Show all challenges
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {filteredRewards.length > 0 ? (
                filteredRewards.map((reward: any) => (
                  <RewardCard 
                    key={reward.id} 
                    reward={reward} 
                    userPoints={userStats.points}
                    onClaim={handleClaimReward}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No rewards found with the current filter.</p>
                  <button 
                    onClick={() => setFilter('all')}
                    className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Show all rewards
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'quests' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
                <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Today's Quests
              </h3>
              
              {dailyQuests.map(quest => (
                <DailyQuest 
                  key={quest.id}
                  title={quest.title}
                  description={quest.description}
                  reward={quest.reward}
                  progress={quest.progress}
                  goal={quest.goal}
                  completed={quest.completed}
                  expiresIn={quest.expiresIn}
                  onClaim={() => handleClaimQuest(quest.id)}
                />
              ))}
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                <h4 className="font-medium text-blue-800 mb-2 dark:text-blue-300">About Daily Quests</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Complete daily quests to earn bonus XP and rewards. New quests are available every day at midnight. Make sure to claim your rewards before they expire!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;