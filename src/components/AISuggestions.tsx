import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, RefreshCw, Plus, X, Sparkles, Brain } from 'lucide-react';
import { generateTaskSuggestions, suggestHabitImprovements, generateFocusTip } from '../lib/deepseek';
import { Task, Habit } from '../types';
import toast from 'react-hot-toast';

interface AISuggestionsProps {
  tasks: Task[];
  habits: Habit[];
  addTask: (text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
  addHabit: (name: string) => void;
  currentPage: string;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ 
  tasks, 
  habits, 
  addTask, 
  addHabit,
  currentPage
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [focusTip, setFocusTip] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [aiMode, setAiMode] = useState<'standard' | 'creative' | 'analytical'>('standard');
  const previousPageRef = useRef<string>('');
  const suggestionHistoryRef = useRef<{[key: string]: string[]}>({
    dashboard: [],
    habits: [],
    focus: []
  });

  useEffect(() => {
    if (currentPage !== previousPageRef.current) {
      previousPageRef.current = currentPage;
      
      if (currentPage === 'dashboard') {
        loadTaskSuggestions();
      } else if (currentPage === 'habits') {
        loadHabitSuggestions();
      } else if (currentPage === 'focus') {
        loadFocusTip();
      }
    }
  }, [currentPage]);

  const loadTaskSuggestions = async () => {
    setLoading(true);
    try {
      // Create a context string from current tasks and habits
      const completedTasks = tasks.filter(t => t.completed).map(t => t.text);
      const pendingTasks = tasks.filter(t => !t.completed).map(t => t.text);
      const habitNames = habits.map(h => h.name);
      
      // Add more context for better AI understanding
      const taskPriorities = tasks
        .filter(t => !t.completed && t.priority)
        .map(t => `${t.text} (${t.priority})`);
      
      const dueDates = tasks
        .filter(t => !t.completed && t.dueDate)
        .map(t => `${t.text} (due: ${t.dueDate})`);
      
      const context = `
        Completed tasks: ${completedTasks.join(', ') || 'None'}
        Pending tasks: ${pendingTasks.join(', ') || 'None'}
        Current habits: ${habitNames.join(', ') || 'None'}
        Task priorities: ${taskPriorities.join(', ') || 'None'}
        Due dates: ${dueDates.join(', ') || 'None'}
        AI mode: ${aiMode}
      `;
      
      const newSuggestions = await generateTaskSuggestions(context);
      
      // Store in history
      suggestionHistoryRef.current.dashboard = newSuggestions;
      
      // Limit to 3 suggestions
      setSuggestions(newSuggestions.slice(0, 3)); 
    } catch (error) {
      console.error('Error loading task suggestions:', error);
      toast.error('Failed to load AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const loadHabitSuggestions = async () => {
    setLoading(true);
    try {
      // Enhance habit context with streak information
      const habitsWithStreaks = habits.map(h => ({
        ...h,
        streakInfo: `${h.name} (streak: ${h.streak} days)`
      }));
      
      const newSuggestions = await suggestHabitImprovements(habitsWithStreaks);
      
      // Store in history
      suggestionHistoryRef.current.habits = newSuggestions;
      
      // Limit to 3 suggestions
      setSuggestions(newSuggestions.slice(0, 3));
    } catch (error) {
      console.error('Error loading habit suggestions:', error);
      toast.error('Failed to load AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const loadFocusTip = async () => {
    setLoading(true);
    try {
      const tip = await generateFocusTip();
      setFocusTip(tip);
      
      // Store in history
      suggestionHistoryRef.current.focus = [tip];
    } catch (error) {
      console.error('Error loading focus tip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion: string) => {
    if (currentPage === 'dashboard') {
      addTask(suggestion);
      toast.success('Task added from AI suggestion');
      
      // Remove the suggestion from the list
      setSuggestions(suggestions.filter(s => s !== suggestion));
    } else if (currentPage === 'habits') {
      addHabit(suggestion);
      toast.success('Habit added from AI suggestion');
      
      // Remove the suggestion from the list
      setSuggestions(suggestions.filter(s => s !== suggestion));
    }
  };

  const handleRefresh = () => {
    if (currentPage === 'dashboard') {
      loadTaskSuggestions();
    } else if (currentPage === 'habits') {
      loadHabitSuggestions();
    } else if (currentPage === 'focus') {
      loadFocusTip();
    }
  };

  const changeAiMode = (mode: 'standard' | 'creative' | 'analytical') => {
    setAiMode(mode);
    toast.success(`AI mode changed to ${mode}`);
    handleRefresh();
  };

  if (!showSuggestions) {
    return (
      <button 
        onClick={() => setShowSuggestions(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 z-10"
        aria-label="Show AI suggestions"
      >
        <Lightbulb className="h-5 w-5" />
      </button>
    );
  }

  if (currentPage === 'focus' && focusTip) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-hidden z-10">
        <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            <span className="font-medium">AI Focus Tip</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleRefresh} 
              className="p-1 hover:bg-blue-700 rounded-full transition-colors duration-200"
              disabled={loading}
              aria-label="Refresh tip"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowSuggestions(false)} 
              className="p-1 hover:bg-blue-700 rounded-full transition-colors duration-200 ml-1"
              aria-label="Close suggestions"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-800 dark:text-gray-200">{focusTip}</p>
        </div>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center pb-2">
          Powered by Advanced AI
        </div>
      </div>
    );
  }

  if (suggestions.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg dark:bg-gray-800 overflow-hidden z-10">
      <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="font-medium">AI Suggestions</span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleRefresh} 
            className="p-1 hover:bg-blue-700 rounded-full transition-colors duration-200"
            disabled={loading}
            aria-label="Refresh suggestions"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowSuggestions(false)} 
            className="p-1 hover:bg-blue-700 rounded-full transition-colors duration-200 ml-1"
            aria-label="Close suggestions"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* AI Mode Selector */}
      <div className="px-4 pt-3 pb-1 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-xs">
          <button 
            onClick={() => changeAiMode('standard')}
            className={`px-2 py-1 rounded ${
              aiMode === 'standard' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Standard
          </button>
          <button 
            onClick={() => changeAiMode('creative')}
            className={`px-2 py-1 rounded ${
              aiMode === 'creative' 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Creative
          </button>
          <button 
            onClick={() => changeAiMode('analytical')}
            className={`px-2 py-1 rounded ${
              aiMode === 'analytical' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            Analytical
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">Generating suggestions...</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded dark:bg-gray-700">
                <span className="text-gray-800 text-sm dark:text-gray-200">{suggestion}</span>
                <button
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="text-blue-600 hover:text-blue-800 p-1 dark:text-blue-400 dark:hover:text-blue-300"
                  aria-label={`Add ${currentPage === 'dashboard' ? 'task' : 'habit'}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Powered by Advanced AI • {aiMode.charAt(0).toUpperCase() + aiMode.slice(1)} Mode
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;