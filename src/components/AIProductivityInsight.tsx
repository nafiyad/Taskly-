import React, { useState, useEffect, useCallback, memo } from 'react';
import { TrendingUp, RefreshCw, BarChart, Calendar, Clock } from 'lucide-react';
import { analyzeProductivity } from '../lib/deepseek';
import { Task, Habit } from '../types';

interface AIProductivityInsightProps {
  tasks: Task[];
  habits: Habit[];
}

// Using memo to prevent unnecessary re-renders
const AIProductivityInsight: React.FC<AIProductivityInsightProps> = memo(({ tasks, habits }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<{
    taskCompletionRate: number;
    habitCompletionRate: number;
    streakAverage: number;
  } | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  // Memoize the calculation function to prevent unnecessary recalculations
  const calculateMetrics = useCallback(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const today = new Date().toISOString().split('T')[0];
    const habitsCompletedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const habitCompletionRate = habits.length > 0 ? Math.round((habitsCompletedToday / habits.length) * 100) : 0;
    
    const streaks = habits.map(h => h.streak);
    const streakAverage = streaks.length > 0 ? 
      Math.round((streaks.reduce((a, b) => a + b, 0) / streaks.length) * 10) / 10 : 0;
    
    return {
      taskCompletionRate,
      habitCompletionRate,
      streakAverage
    };
  }, [tasks, habits]);

  // Update metrics only when tasks or habits change
  useEffect(() => {
    setMetrics(calculateMetrics());
  }, [calculateMetrics]);

  // Load insight with debounce to prevent too frequent API calls
  useEffect(() => {
    const now = Date.now();
    // Only update if it's been at least 10 seconds since the last update
    if (now - lastUpdateTime > 10000) {
      loadInsight();
      setLastUpdateTime(now);
    }
  }, [metrics]);

  const loadInsight = async () => {
    // Don't reload if already loading
    if (loading) return;
    
    setLoading(true);
    try {
      const analysis = await analyzeProductivity(tasks, habits);
      setInsight(analysis);
    } catch (error) {
      console.error('Error loading productivity insight:', error);
      setInsight('Focus on completing your most important tasks first and maintaining consistency with your habits.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3 dark:bg-purple-900 dark:text-purple-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">AI Productivity Insight</h3>
        </div>
        <button
          onClick={loadInsight}
          disabled={loading}
          className="text-gray-500 hover:text-gray-700 p-1 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="Refresh insight"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded p-3 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-blue-500 mr-1 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Task Completion</span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">{metrics.taskCompletionRate}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
              <div className="bg-blue-500 h-1.5 rounded-full dark:bg-blue-400" style={{ width: `${metrics.taskCompletionRate}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded p-3 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-green-500 mr-1 dark:text-green-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Habit Completion</span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">{metrics.habitCompletionRate}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
              <div className="bg-green-500 h-1.5 rounded-full dark:bg-green-400" style={{ width: `${metrics.habitCompletionRate}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded p-3 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-purple-500 mr-1 dark:text-purple-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Avg. Streak</span>
              </div>
              <span className="text-sm font-bold text-gray-800 dark:text-white">{metrics.streakAverage} days</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
              <div className="bg-purple-500 h-1.5 rounded-full dark:bg-purple-400" 
                   style={{ width: `${Math.min(metrics.streakAverage * 10, 100)}%` }}></div>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-300">Analyzing your productivity patterns...</span>
        </div>
      ) : (
        <div className="text-gray-700 dark:text-gray-300 bg-purple-50 p-3 rounded-md dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
          {insight}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-right">
        Powered by Advanced AI
      </div>
    </div>
  );
});

// Add display name for debugging
AIProductivityInsight.displayName = 'AIProductivityInsight';

export default AIProductivityInsight;