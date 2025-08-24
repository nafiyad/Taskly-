import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { Task, Habit, UserStats, TimerState, UserSubscription } from '../types';
import { CheckCircle, Calendar, Clock, Award, Zap, Trophy, Play, Pause, Filter, Lock } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import AITaskPrioritizer from '../components/AITaskPrioritizer';
import ProBadge from '../components/ProBadge';
import { getFeatureLimit } from '../lib/featureLimits';

interface DashboardProps {
  tasks: Task[];
  addTask: (text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, newText: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
  habits: Habit[];
  setCurrentPage: (page: string) => void;
  userStats: UserStats;
  timerState: TimerState;
  toggleTimer: () => void;
  subscription: UserSubscription;
}

const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  habits,
  setCurrentPage,
  userStats,
  timerState,
  toggleTimer,
  subscription
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'today' | 'overdue'>('all');
  const isPro = subscription.plan === 'pro';
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = tasks.filter(task => !task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const today = new Date().toISOString().split('T')[0];
  const habitsCompletedToday = habits.filter(habit => 
    habit.completedDates.includes(today)
  ).length;

  // Calculate XP progress to next level
  const currentLevelPoints = (userStats.level - 1) * 100;
  const nextLevelPoints = userStats.level * 100;
  const progress = ((userStats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  // Get earned badges
  const earnedBadges = userStats.badges.filter(badge => badge.earned);
  
  // Filter tasks based on selected filter
  const todayTasks = tasks.filter(task => task.dueDate === today && !task.completed).length;
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date(today);
  }).length;
  
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'today':
        return task.dueDate === today && !task.completed;
      case 'overdue':
        if (!task.dueDate || task.completed) return false;
        return new Date(task.dueDate) < new Date(today);
      default:
        return true;
    }
  });

  // Get task limit for free plan
  const taskLimit = getFeatureLimit(subscription.plan, 'tasks') as number;
  const isAtTaskLimit = !isPro && tasks.length >= taskLimit;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Dashboard</h1>
      
      {/* Level Progress */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Level {userStats.level}</p>
              <p className="text-xl font-semibold dark:text-white">{userStats.points} XP</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {userStats.points - currentLevelPoints}/{nextLevelPoints - currentLevelPoints} to Level {userStats.level + 1}
          </div>
        </div>
        <ProgressBar progress={progress} color="blue" height={4} />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</p>
              <p className="text-xl font-semibold dark:text-white">{completedTasks}/{totalTasks}</p>
            </div>
          </div>
          {totalTasks > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{completionRate}% completed</p>
            </div>
          )}
          {!isPro && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Limit: {totalTasks}/{taskLimit} tasks</span>
              {isAtTaskLimit && (
                <button 
                  onClick={() => setCurrentPage('subscription')}
                  className="text-blue-600 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Upgrade
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 dark:bg-green-900 dark:text-green-300">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Habits Today</p>
              <p className="text-xl font-semibold dark:text-white">{habitsCompletedToday}/{habits.length}</p>
            </div>
          </div>
          {habits.length > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-600 h-2.5 rounded-full dark:bg-green-500" 
                  style={{ width: `${habits.length > 0 ? (habitsCompletedToday / habits.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
          {!isPro && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Limit: {habits.length}/{getFeatureLimit(subscription.plan, 'habits')} habits
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 dark:bg-purple-900 dark:text-purple-300">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Focus Sessions</p>
              <p className="text-xl font-semibold dark:text-white">{userStats.focusSessionsCompleted}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Longest streak: {userStats.longestStreak} days
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timer Status (if active) */}
      {timerState.isActive && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 dark:bg-purple-900 dark:text-purple-300">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {timerState.timerMode === 'focus' ? 'Focus Session' : timerState.timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </p>
                <p className="text-xl font-semibold dark:text-white">
                  {String(timerState.minutes).padStart(2, '0')}:{String(timerState.seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={toggleTimer}
                className={`p-3 rounded-full ${
                  timerState.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {timerState.isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Badges Section */}
      {earnedBadges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Your Badges</h2>
          <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
            <div className="flex flex-wrap gap-4">
              {earnedBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-2 dark:bg-yellow-900 dark:text-yellow-300">
                    <Award className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Tasks Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
          
          <div className="flex items-center space-x-2">
            {isPro && (
              <AITaskPrioritizer tasks={tasks} editTask={editTask} />
            )}
            
            <div className="flex items-center ml-2">
              <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Tasks ({tasks.length})</option>
                <option value="active">Active ({activeTasks})</option>
                <option value="completed">Completed ({completedTasks})</option>
                <option value="today">Due Today ({todayTasks})</option>
                <option value="overdue">Overdue ({overdueTasks})</option>
              </select>
            </div>
          </div>
        </div>
        
        <TaskForm addTask={addTask} isAtLimit={isAtTaskLimit} />
        <TaskList
          tasks={filteredTasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          editTask={editTask}
        />
        
        {isAtTaskLimit && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between dark:bg-blue-900/20 dark:border-blue-800/30">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-blue-500 mr-2 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">
                You've reached the limit of {taskLimit} tasks on the Free plan.
              </span>
            </div>
            <button
              onClick={() => setCurrentPage('subscription')}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
      
      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center dark:text-white">
              <Calendar className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
              Habit Tracker
            </h3>
            <p className="text-gray-600 mb-4 dark:text-gray-300">Track your daily and weekly habits to build consistency.</p>
            <button 
              onClick={() => setCurrentPage('habits')}
              className="text-green-600 hover:text-green-800 font-medium dark:text-green-400 dark:hover:text-green-300"
            >
              Go to Habit Tracker →
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow dark:bg-gray-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center dark:text-white">
                <Clock className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Focus Mode
              </h3>
              {isPro && <ProBadge size="sm" />}
            </div>
            <p className="text-gray-600 mb-4 dark:text-gray-300">Use the Pomodoro technique to boost your productivity.</p>
            <button 
              onClick={() => setCurrentPage('focus')}
              className="text-purple-600 hover:text-purple-800 font-medium dark:text-purple-400 dark:hover:text-purple-300"
            >
              Start Focus Session →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;