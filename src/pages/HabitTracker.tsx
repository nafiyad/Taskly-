import React, { useState, useEffect, useCallback } from 'react';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';
import { Habit, UserStats, UserSubscription } from '../types';
import { Award, TrendingUp, Calendar, Zap, Lock } from 'lucide-react';
import AIProductivityInsight from '../components/AIProductivityInsight';
import { getFeatureLimit } from '../lib/featureLimits';

interface HabitTrackerProps {
  habits: Habit[];
  addHabit: (name: string) => void;
  toggleHabit: (id: number) => void;
  deleteHabit: (id: number) => void;
  userStats: UserStats;
  subscription: UserSubscription;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  addHabit,
  toggleHabit,
  deleteHabit,
  userStats,
  subscription
}) => {
  const [metrics, setMetrics] = useState({
    habitsCompletedToday: 0,
    completionRate: 0,
    longestStreak: 0
  });
  
  const isPro = subscription.plan === 'pro';
  const habitLimit = getFeatureLimit(subscription.plan, 'habits') as number;
  const isAtHabitLimit = !isPro && habits.length >= habitLimit;
  
  // Memoize the calculation of metrics to prevent unnecessary recalculations
  const calculateMetrics = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const habitsCompletedToday = habits.filter(habit => 
      habit.completedDates.includes(today)
    ).length;
    
    const completionRate = habits.length > 0 
      ? Math.round((habitsCompletedToday / habits.length) * 100) 
      : 0;
    
    const longestStreak = habits.length > 0
      ? Math.max(...habits.map(habit => habit.streak))
      : 0;
      
    return { habitsCompletedToday, completionRate, longestStreak };
  }, [habits]);
  
  // Update metrics only when habits change
  useEffect(() => {
    setMetrics(calculateMetrics());
  }, [calculateMetrics]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Habit Tracker</h1>
      
      {/* AI Productivity Insight - wrapped with React.memo in the component itself */}
      {isPro && <AIProductivityInsight tasks={[]} habits={habits} />}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 dark:bg-green-900 dark:text-green-300">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Progress</p>
              <p className="text-xl font-semibold dark:text-white">{metrics.habitsCompletedToday}/{habits.length}</p>
            </div>
          </div>
          {habits.length > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2.5 rounded-full dark:bg-green-500" 
                  style={{ width: `${metrics.completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{metrics.completionRate}% completed</p>
            </div>
          )}
          {!isPro && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Limit: {habits.length}/{habitLimit} habits
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Habits</p>
              <p className="text-xl font-semibold dark:text-white">{habits.length}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {habits.length * 15} potential points daily
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4 dark:bg-yellow-900 dark:text-yellow-300">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Longest Streak</p>
              <p className="text-xl font-semibold dark:text-white">{userStats.longestStreak} days</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <Award className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Current record: {metrics.longestStreak} days
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Habits Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Your Habits</h2>
        <HabitForm addHabit={addHabit} isAtLimit={isAtHabitLimit} />
        <HabitList
          habits={habits}
          toggleHabit={toggleHabit}
          deleteHabit={deleteHabit}
        />
        
        {isAtHabitLimit && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between dark:bg-blue-900/20 dark:border-blue-800/30">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-blue-500 mr-2 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">
                You've reached the limit of {habitLimit} habits on the Free plan.
              </span>
            </div>
            <button
              onClick={() => window.location.hash = 'subscription'}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
      
      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 dark:bg-blue-900/30">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 dark:text-blue-300">Habit Building Tips</h3>
        <ul className="space-y-2 text-blue-700 dark:text-blue-200">
          <li className="flex items-start">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-800 dark:text-blue-300">1</span>
            Start small - focus on one or two habits at a time
          </li>
          <li className="flex items-start">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-800 dark:text-blue-300">2</span>
            Be consistent - try to complete your habits at the same time each day
          </li>
          <li className="flex items-start">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-800 dark:text-blue-300">3</span>
            Stack habits - connect new habits to existing routines
          </li>
          <li className="flex items-start">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center mr-2 mt-0.5 dark:bg-blue-800 dark:text-blue-300">4</span>
            Celebrate small wins - reward yourself for maintaining streaks
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HabitTracker;