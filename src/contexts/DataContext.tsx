import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase, isMockClient } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Task, Habit, UserStats, Badge, AppSettings, Achievement, Challenge, Reward } from '../types';
import { toast } from 'react-hot-toast';

interface DataContextType {
  tasks: Task[];
  habits: Habit[];
  userStats: UserStats;
  settings: AppSettings;
  loading: boolean;
  addTask: (text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  editTask: (id: number, newText: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => Promise<void>;
  addHabit: (name: string) => Promise<void>;
  toggleHabit: (id: number) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  completeFocusSession: () => Promise<void>;
  updateSettings: (newSettings: AppSettings) => Promise<void>;
  claimAchievement: (id: number) => Promise<void>;
  joinChallenge: (id: number) => Promise<void>;
  claimChallenge: (id: number) => Promise<void>;
  claimReward: (id: number) => Promise<void>;
  analyzeTask: (text: string) => Promise<AIAnalysis>;
  getProductivityInsights: () => Promise<AIInsight[]>;
  getHabitRecommendations: () => Promise<string[]>;
  optimizeSchedule: () => Promise<void>;
  getPriorityScore: (task: Task) => number;
}

const defaultSettings: AppSettings = {
  theme: 'light',
  notifications: true,
  focusTime: 25,
  shortBreak: 5,
  longBreak: 15
};

const defaultUserStats: UserStats = {
  points: 0,
  level: 1,
  tasksCompleted: 0,
  habitsCompleted: 0,
  focusSessionsCompleted: 0,
  longestStreak: 0,
  badges: [],
  achievements: [],
  challenges: [],
  rewards: [],
  streak: 0,
  experience: 0,
  experienceToNextLevel: 100
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// Add type definitions for badge and user badge data
interface BadgeData {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_count: number;
}

interface UserBadgeData {
  badge_id: number;
  earned_at: string;
}

// Add new AI-related interfaces
interface AIAnalysis {
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string;
  suggestedDeadline?: string;
  subtasks?: string[];
  estimatedDuration?: number;
  tags?: string[];
}

interface AIInsight {
  type: 'productivity' | 'pattern' | 'suggestion' | 'warning';
  title: string;
  description: string;
  confidence: number;
  actionItems?: string[];
  impact?: 'low' | 'medium' | 'high';
  category?: 'task' | 'habit' | 'focus' | 'general';
}

// Add missing interfaces
interface TaskData {
  id: number;
  text: string;
  completed: boolean;
  due_date?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  user_id: string;
}

interface HabitData {
  id: number;
  name: string;
  streak: number;
  user_id: string;
  habit_completions: { completion_date: string }[];
}

// Add missing utility functions
const calculateDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateComplexityScore = (task: Task): number => {
  let score = 0;
  
  // Base complexity on text length
  score += Math.min(task.text.length / 100, 0.5);
  
  // Add complexity for notes
  if (task.notes) {
    score += Math.min(task.notes.length / 200, 0.3);
  }
  
  return Math.min(score, 1);
};

const calculateDependencyScore = (task: Task): number => {
  // Example implementation using the task parameter
  const hasNotes = task.notes ? 0.2 : 0;
  const hasDueDate = task.dueDate ? 0.3 : 0;
  return Math.min(hasNotes + hasDueDate, 1);
};

// Add analysis helper functions
const analyzeTaskPatterns = (tasks: Task[]) => {
  return {
    completionRate: tasks.filter(t => t.completed).length / tasks.length,
    averageComplexity: tasks.reduce((acc, t) => acc + calculateComplexityScore(t), 0) / tasks.length,
    priorityDistribution: {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    }
  };
};

const analyzeHabitStreaks = (habits: Habit[]) => {
  return {
    averageStreak: habits.reduce((acc, h) => acc + h.streak, 0) / habits.length,
    maxStreak: Math.max(...habits.map(h => h.streak)),
    totalCompletions: habits.reduce((acc, h) => acc + h.completedDates.length, 0)
  };
};

const analyzeFocusSessionStats = (stats: UserStats) => {
  return {
    totalSessions: stats.focusSessionsCompleted,
    averageSessionsPerDay: stats.focusSessionsCompleted / 30, // Assuming last 30 days
    productivity: stats.focusSessionsCompleted > 0 ? stats.points / stats.focusSessionsCompleted : 0
  };
};

// Create AI service
const aiService = {
  analyze: async (prompt: string): Promise<{
    priority: 'low' | 'medium' | 'high';
    confidence: number;
    reasoning: string;
    deadline?: string;
    subtasks?: string[];
    duration?: number;
    tags?: string[];
  }> => {
    // Use the prompt parameter in the analysis
    const urgencyKeywords = ['urgent', 'asap', 'immediately'].some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );
    
    return {
      priority: urgencyKeywords ? 'high' : 'medium',
      confidence: 0.8,
      reasoning: `Analysis based on prompt: ${prompt}`,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subtasks: ['Plan', 'Execute', 'Review'],
      duration: 120,
      tags: ['work', 'important']
    };
  },
  
  generateInsights: async (prompt: string): Promise<AIInsight[]> => {
    // Use the prompt parameter to generate insights
    return [{
      type: 'productivity',
      title: 'Analysis Result',
      description: `Generated insight based on: ${prompt}`,
      confidence: 0.9,
      impact: 'high',
      category: 'task'
    }];
  }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Reset data when user logs out
      setTasks([]);
      setHabits([]);
      setUserStats(defaultUserStats);
      setSettings(defaultSettings);
      setLoading(false);
      setInitialized(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // If using mock client, use demo data instead of trying to fetch from Supabase
      if (isMockClient()) {
        loadDemoData();
        return;
      }
      
      // Initialize user data if needed
      await initializeUserData();
      setInitialized(true);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      
      // Fetch habits and their completions
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*, habit_completions(completion_date)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*');

      // Fetch user badges
      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id);

      // Process badges
      const allBadges: Badge[] = [];
      if (badgesData) {
        (badgesData as BadgeData[]).forEach((badge: BadgeData) => {
          const userBadge = userBadgesData?.find((ub: UserBadgeData) => ub.badge_id === badge.id);
          allBadges.push({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earned: !!userBadge,
            earnedAt: userBadge?.earned_at,
            requirement: {
              type: badge.requirement_type as 'tasks' | 'habits' | 'focus' | 'level',
              count: badge.requirement_count
            }
          });
        });
      }

      // Create mock achievements, challenges, and rewards for demo
      const mockAchievements: Achievement[] = [
        {
          id: 1,
          name: 'Task Master',
          description: 'Complete 10 tasks',
          icon: 'check',
          progress: statsData?.tasks_completed || 0,
          maxProgress: 10,
          completed: (statsData?.tasks_completed || 0) >= 10,
          category: 'milestone',
          reward: 50
        },
        {
          id: 2,
          name: 'Habit Former',
          description: 'Maintain a 7-day streak',
          icon: 'award',
          progress: statsData?.longest_streak || 0,
          maxProgress: 7,
          completed: (statsData?.longest_streak || 0) >= 7,
          category: 'milestone',
          reward: 100
        },
        {
          id: 3,
          name: 'Focus Champion',
          description: 'Complete 5 focus sessions',
          icon: 'clock',
          progress: statsData?.focus_sessions_completed || 0,
          maxProgress: 5,
          completed: (statsData?.focus_sessions_completed || 0) >= 5,
          category: 'milestone',
          reward: 75
        },
        {
          id: 4,
          name: 'Early Bird',
          description: 'Complete a task before 9 AM',
          icon: 'star',
          progress: 0,
          maxProgress: 1,
          completed: false,
          category: 'daily',
          reward: 25
        },
        {
          id: 5,
          name: 'Productivity Guru',
          description: 'Complete all daily habits for a week',
          icon: 'trophy',
          progress: 3,
          maxProgress: 7,
          completed: false,
          category: 'weekly',
          reward: 150
        }
      ];
      
      const mockChallenges: Challenge[] = [
        {
          id: 1,
          name: 'Summer Productivity Sprint',
          description: 'Complete 30 tasks in 30 days',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
          goal: 30,
          progress: 12,
          completed: false,
          reward: 300
        },
        {
          id: 2,
          name: 'Focus Week Challenge',
          description: 'Complete 10 focus sessions in a week',
          startDate: '2025-06-05',
          endDate: '2025-06-12',
          goal: 10,
          progress: 4,
          completed: false,
          reward: 200
        },
        {
          id: 3,
          name: 'Habit Streak Challenge',
          description: 'Maintain all habits for 14 days straight',
          startDate: '2025-05-20',
          endDate: '2025-06-03',
          goal: 14,
          progress: 14,
          completed: true,
          reward: 250
        }
      ];
      
      const mockRewards: Reward[] = [
        {
          id: 1,
          name: 'Dark Theme',
          description: 'Unlock the dark theme for the app',
          cost: 100,
          icon: 'star',
          unlocked: true,
          claimed: true
        },
        {
          id: 2,
          name: 'Custom Task Categories',
          description: 'Create custom categories for your tasks',
          cost: 200,
          icon: 'trophy',
          unlocked: true,
          claimed: false
        },
        {
          id: 3,
          name: 'Advanced Analytics',
          description: 'Unlock detailed productivity analytics',
          cost: 500,
          icon: 'award',
          unlocked: false,
          claimed: false
        },
        {
          id: 4,
          name: 'Custom Themes',
          description: 'Choose from a variety of app themes',
          cost: 300,
          icon: 'gift',
          unlocked: false,
          claimed: false
        },
        {
          id: 5,
          name: 'Priority Support',
          description: 'Get priority support from our team',
          cost: 1000,
          icon: 'crown',
          unlocked: false,
          claimed: false
        }
      ];

      if (statsData) {
        setUserStats({
          points: statsData.points,
          level: statsData.level,
          tasksCompleted: statsData.tasks_completed,
          habitsCompleted: statsData.habits_completed,
          focusSessionsCompleted: statsData.focus_sessions_completed,
          longestStreak: statsData.longest_streak,
          badges: allBadges,
          achievements: mockAchievements,
          challenges: mockChallenges,
          rewards: mockRewards,
          streak: statsData.longest_streak,
          lastActive: new Date().toISOString().split('T')[0],
          experience: statsData.points % 100,
          experienceToNextLevel: 100
        });
      }
      
      setBadges(allBadges);

      // Fetch user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (settingsData) {
        setSettings({
          theme: settingsData.theme as 'light' | 'dark' | 'system',
          notifications: settingsData.notifications,
          focusTime: settingsData.focus_time,
          shortBreak: settingsData.short_break,
          longBreak: settingsData.long_break
        });
      }

      // Process tasks
      if (tasksData) {
        const formattedTasks: Task[] = (tasksData as TaskData[]).map((task: TaskData) => ({
          id: task.id,
          text: task.text,
          completed: task.completed,
          dueDate: task.due_date,
          priority: task.priority,
          notes: task.notes,
          points: getTaskPoints(task.priority)
        }));
        setTasks(formattedTasks);
      }

      // Process habits
      if (habitsData) {
        const formattedHabits: Habit[] = (habitsData as HabitData[]).map((habit: HabitData) => {
          const completedDates = habit.habit_completions.map(completion => completion.completion_date);
          return {
            id: habit.id,
            name: habit.name,
            streak: habit.streak,
            completedDates,
            points: 15
          };
        });
        setHabits(formattedHabits);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // If there's an error fetching data, load demo data instead
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  // Load demo data for development or when Supabase connection fails
  const loadDemoData = () => {
    // Demo tasks
    const demoTasks: Task[] = [
      {
        id: 1,
        text: 'Complete project proposal',
        completed: false,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        priority: 'high',
        notes: 'Include budget estimates and timeline',
        points: 20
      },
      {
        id: 2,
        text: 'Schedule team meeting',
        completed: true,
        dueDate: new Date().toISOString().split('T')[0], // Today
        priority: 'medium',
        notes: 'Discuss quarterly goals',
        points: 15
      },
      {
        id: 3,
        text: 'Review client feedback',
        completed: false,
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        priority: 'medium',
        notes: '',
        points: 15
      },
      {
        id: 4,
        text: 'Update portfolio website',
        completed: false,
        priority: 'low',
        notes: 'Add recent projects',
        points: 10
      },
      {
        id: 5,
        text: 'Read chapter 5 of productivity book',
        completed: true,
        notes: 'Take notes on key concepts',
        points: 10
      }
    ];

    // Demo habits
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    
    const demoHabits: Habit[] = [
      {
        id: 1,
        name: 'Morning meditation',
        streak: 3,
        completedDates: [today, yesterday, twoDaysAgo],
        points: 15
      },
      {
        id: 2,
        name: 'Read for 30 minutes',
        streak: 2,
        completedDates: [today, yesterday],
        points: 15
      },
      {
        id: 3,
        name: 'Exercise',
        streak: 0,
        completedDates: [],
        points: 15
      }
    ];

    // Demo badges
    const demoBadges: Badge[] = [
      {
        id: 1,
        name: 'First Step',
        description: 'Complete your first task',
        icon: 'check-circle',
        earned: true,
        earnedAt: new Date(Date.now() - 604800000).toISOString(), // A week ago
        requirement: {
          type: 'tasks',
          count: 1
        }
      },
      {
        id: 2,
        name: 'On a Roll',
        description: 'Complete 5 tasks in a single day',
        icon: 'zap',
        earned: true,
        earnedAt: new Date(Date.now() - 172800000).toISOString(), // Two days ago
        requirement: {
          type: 'tasks',
          count: 5
        }
      },
      {
        id: 3,
        name: 'Habit Master',
        description: 'Maintain a 7-day habit streak',
        icon: 'award',
        earned: false,
        requirement: {
          type: 'habits',
          count: 7
        }
      },
      {
        id: 4,
        name: 'Focus Champion',
        description: 'Complete 10 focus sessions',
        icon: 'clock',
        earned: false,
        requirement: {
          type: 'focus',
          count: 10
        }
      },
      {
        id: 5,
        name: 'Productivity Guru',
        description: 'Reach level 5',
        icon: 'star',
        earned: false,
        requirement: {
          type: 'level',
          count: 5
        }
      }
    ];

    // Demo achievements
    const demoAchievements: Achievement[] = [
      {
        id: 1,
        name: 'Task Master',
        description: 'Complete 10 tasks',
        icon: 'check',
        progress: 7,
        maxProgress: 10,
        completed: false,
        category: 'milestone',
        reward: 50
      },
      {
        id: 2,
        name: 'Habit Former',
        description: 'Maintain a 7-day streak',
        icon: 'award',
        progress: 3,
        maxProgress: 7,
        completed: false,
        category: 'milestone',
        reward: 100
      },
      {
        id: 3,
        name: 'Focus Champion',
        description: 'Complete 5 focus sessions',
        icon: 'clock',
        progress: 3,
        maxProgress: 5,
        completed: false,
        category: 'milestone',
        reward: 75
      },
      {
        id: 4,
        name: 'Early Bird',
        description: 'Complete a task before 9 AM',
        icon: 'star',
        progress: 1,
        maxProgress: 1,
        completed: true,
        category: 'daily',
        reward: 25
      },
      {
        id: 5,
        name: 'Productivity Guru',
        description: 'Complete all daily habits for a week',
        icon: 'trophy',
        progress: 3,
        maxProgress: 7,
        completed: false,
        category: 'weekly',
        reward: 150
      }
    ];

    // Demo challenges
    const demoChallenges: Challenge[] = [
      {
        id: 1,
        name: 'Summer Productivity Sprint',
        description: 'Complete 30 tasks in 30 days',
        startDate: '2025-06-01',
        endDate: '2025-06-30',
        goal: 30,
        progress: 12,
        completed: false,
        reward: 300
      },
      {
        id: 2,
        name: 'Focus Week Challenge',
        description: 'Complete 10 focus sessions in a week',
        startDate: '2025-06-05',
        endDate: '2025-06-12',
        goal: 10,
        progress: 4,
        completed: false,
        reward: 200
      },
      {
        id: 3,
        name: 'Habit Streak Challenge',
        description: 'Maintain all habits for 14 days straight',
        startDate: '2025-05-20',
        endDate: '2025-06-03',
        goal: 14,
        progress: 14,
        completed: true,
        reward: 250
      }
    ];

    // Demo rewards
    const demoRewards: Reward[] = [
      {
        id: 1,
        name: 'Dark Theme',
        description: 'Unlock the dark theme for the app',
        cost: 100,
        icon: 'star',
        unlocked: true,
        claimed: true
      },
      {
        id: 2,
        name: 'Custom Task Categories',
        description: 'Create custom categories for your tasks',
        cost: 200,
        icon: 'trophy',
        unlocked: true,
        claimed: false
      },
      {
        id: 3,
        name: 'Advanced Analytics',
        description: 'Unlock detailed productivity analytics',
        cost: 500,
        icon: 'award',
        unlocked: false,
        claimed: false
      },
      {
        id: 4,
        name: 'Custom Themes',
        description: 'Choose from a variety of app themes',
        cost: 300,
        icon: 'gift',
        unlocked: false,
        claimed: false
      },
      {
        id: 5,
        name: 'Priority Support',
        description: 'Get priority support from our team',
        cost: 1000,
        icon: 'crown',
        unlocked: false,
        claimed: false
      }
    ];

    // Set demo data
    setTasks(demoTasks);
    setHabits(demoHabits);
    setBadges(demoBadges);
    setUserStats({
      points: 175,
      level: 2,
      tasksCompleted: 7,
      habitsCompleted: 12,
      focusSessionsCompleted: 3,
      longestStreak: 3,
      badges: demoBadges,
      achievements: demoAchievements,
      challenges: demoChallenges,
      rewards: demoRewards,
      streak: 3,
      lastActive: today,
      experience: 75,
      experienceToNextLevel: 100
    });
    
    // Set initialized to true to prevent re-initialization
    setInitialized(true);
    
    // Show a toast to inform the user they're using demo data
    toast.success('Using demo data. Connect to Supabase for full functionality.', { duration: 5000 });
  };

  // Helper function to determine task points based on priority
  const getTaskPoints = (priority?: 'low' | 'medium' | 'high'): number => {
    switch (priority) {
      case 'high':
        return 20;
      case 'medium':
        return 15;
      case 'low':
        return 10;
      default:
        return 10;
    }
  };

  // Initialize user data if it doesn't exist
  const initializeUserData = async () => {
    if (!user || initialized) return;

    try {
      // Check if user stats exist
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('id')
        .eq('user_id', user.id);

      // If no stats exist or error indicates no rows, create default stats
      if (statsError || !statsData || statsData.length === 0) {
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            points: 0,
            level: 1,
            tasks_completed: 0,
            habits_completed: 0,
            focus_sessions_completed: 0,
            longest_streak: 0
          });
      }

      // Check if user settings exist
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id);

      // If no settings exist or error indicates no rows, create default settings
      if (settingsError || !settingsData || settingsData.length === 0) {
        await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            theme: 'light',
            notifications: true,
            focus_time: 25,
            short_break: 5,
            long_break: 15
          });
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  };

  // Check for badge achievements
  useEffect(() => {
    if (!user || badges.length === 0) return;

    const checkBadges = async () => {
      const updatedBadges = [...badges];
      let badgesUpdated = false;
      
      // Check each badge
      for (const badge of updatedBadges) {
        if (!badge.earned && badge.requirement) {
          let earned = false;
          
          switch (badge.requirement.type) {
            case 'tasks':
              if (userStats.tasksCompleted >= badge.requirement.count) {
                earned = true;
              }
              break;
            case 'habits':
              if (userStats.longestStreak >= badge.requirement.count) {
                earned = true;
              }
              break;
            case 'focus':
              if (userStats.focusSessionsCompleted >= badge.requirement.count) {
                earned = true;
              }
              break;
            case 'level':
              if (userStats.level >= badge.requirement.count) {
                earned = true;
              }
              break;
          }
          
          if (earned) {
            badge.earned = true;
            const earnedAt = new Date().toISOString();
            badge.earnedAt = earnedAt;
            badgesUpdated = true;
            
            // Save to database if not using mock client
            if (!isMockClient()) {
              await supabase
                .from('user_badges')
                .insert({
                  user_id: user.id,
                  badge_id: badge.id,
                  earned_at: earnedAt
                });
            }
              
            toast.success(`🏆 Badge earned: ${badge.name}!`);
          }
        }
      }
      
      if (badgesUpdated) {
        setUserStats(prev => ({
          ...prev,
          badges: updatedBadges
        }));
      }
    };
    
    checkBadges();
  }, [userStats.tasksCompleted, userStats.habitsCompleted, userStats.focusSessionsCompleted, userStats.level, userStats.longestStreak, user, badges]);

  // Add points and update level
  const addPoints = async (points: number) => {
    if (!user) return;
    
    const newPoints = userStats.points + points;
    const newExperience = (userStats.experience + points) % 100;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    // Check if level up occurred
    const didLevelUp = newLevel > userStats.level;
    
    // Update local state
    setUserStats(prev => ({
      ...prev,
      points: newPoints,
      level: newLevel,
      experience: newExperience,
      experienceToNextLevel: 100
    }));
    
    // Update database if not using mock client
    if (!isMockClient()) {
      await supabase
        .from('user_stats')
        .update({
          points: newPoints,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    }
      
    // Show level up notification
    if (didLevelUp) {
      toast.success(`🎉 Level up! You're now level ${newLevel}!`);
    }
  };

  // Task functions
  const addTask = async (text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => {
    if (!user) return;
    
    try {
      const taskPoints = getTaskPoints(priority);
      
      if (isMockClient()) {
        // Create a new task with a unique ID
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        const newTask: Task = {
          id: newId,
          text,
          completed: false,
          dueDate,
          priority,
          notes,
          points: taskPoints
        };
        
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task added successfully!');
        return;
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          text,
          user_id: user.id,
          due_date: dueDate,
          priority,
          notes
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newTask: Task = {
          id: data.id,
          text: data.text,
          completed: data.completed,
          dueDate: data.due_date,
          priority: data.priority as 'low' | 'medium' | 'high' | undefined,
          notes: data.notes,
          points: taskPoints
        };
        
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task added successfully!');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.');
    }
  };

  const toggleTask = async (id: number) => {
    if (!user) return;
    
    try {
      // Find the task
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const newCompleted = !task.completed;
      
      // Update local state
      setTasks(
        tasks.map(task => {
          if (task.id === id) {
            return { ...task, completed: newCompleted };
          }
          return task;
        })
      );
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('tasks')
          .update({ completed: newCompleted })
          .eq('id', id)
          .eq('user_id', user.id);
      }
        
      // Update stats
      if (newCompleted) {
        // Add points if task is being completed
        await addPoints(task.points || 10);
        
        const newTasksCompleted = userStats.tasksCompleted + 1;
        setUserStats(prev => ({
          ...prev,
          tasksCompleted: newTasksCompleted
        }));
        
        if (!isMockClient()) {
          await supabase
            .from('user_stats')
            .update({
              tasks_completed: newTasksCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
          
        // Update achievements
        setUserStats(prev => ({
          ...prev,
          achievements: prev.achievements.map(achievement => {
            if (achievement.id === 1) { // Task Master achievement
              const newProgress = achievement.progress + 1;
              const completed = newProgress >= achievement.maxProgress;
              return {
                ...achievement,
                progress: newProgress,
                completed
              };
            }
            return achievement;
          })
        }));
      } else {
        // Remove points if task is being uncompleted
        await addPoints(-(task.points || 10));
        
        const newTasksCompleted = Math.max(0, userStats.tasksCompleted - 1);
        setUserStats(prev => ({
          ...prev,
          tasksCompleted: newTasksCompleted
        }));
        
        if (!isMockClient()) {
          await supabase
            .from('user_stats')
            .update({
              tasks_completed: newTasksCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
          
        // Update achievements
        setUserStats(prev => ({
          ...prev,
          achievements: prev.achievements.map(achievement => {
            if (achievement.id === 1) { // Task Master achievement
              const newProgress = Math.max(0, achievement.progress - 1);
              const completed = newProgress >= achievement.maxProgress;
              return {
                ...achievement,
                progress: newProgress,
                completed
              };
            }
            return achievement;
          })
        }));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id: number) => {
    if (!user) return;
    
    try {
      // Check if the task was completed before deleting
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      // Update local state
      setTasks(tasks.filter(task => task.id !== id));
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }
        
      // Update stats if task was completed
      if (task.completed) {
        // Remove points for the completed task
        await addPoints(-(task.points || 10));
        
        const newTasksCompleted = Math.max(0, userStats.tasksCompleted - 1);
        setUserStats(prev => ({
          ...prev,
          tasksCompleted: newTasksCompleted
        }));
        
        if (!isMockClient()) {
          await supabase
            .from('user_stats')
            .update({
              tasks_completed: newTasksCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
          
        // Update achievements
        setUserStats(prev => ({
          ...prev,
          achievements: prev.achievements.map(achievement => {
            if (achievement.id === 1) { // Task Master achievement
              const newProgress = Math.max(0, achievement.progress - 1);
              const completed = newProgress >= achievement.maxProgress;
              return {
                ...achievement,
                progress: newProgress,
                completed
              };
            }
            return achievement;
          })
        }));
      }
      
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const editTask = async (id: number, newText: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => {
    if (!user) return;
    
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const taskPoints = getTaskPoints(priority);
      
      // Update local state
      setTasks(
        tasks.map(task => (task.id === id ? { 
          ...task, 
          text: newText,
          dueDate,
          priority,
          notes,
          points: taskPoints
        } : task))
      );
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('tasks')
          .update({ 
            text: newText,
            due_date: dueDate,
            priority,
            notes
          })
          .eq('id', id)
          .eq('user_id', user.id);
      }
        
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Failed to update task. Please try again.');
    }
  };

  // Habit functions
  const addHabit = async (name: string) => {
    if (!user) return;
    
    try {
      if (isMockClient()) {
        // Create a new habit with a unique ID
        const newId = habits.length > 0 ? Math.max(...habits.map(h => h.id)) + 1 : 1;
        const newHabit: Habit = {
          id: newId,
          name,
          streak: 0,
          completedDates: [],
          points: 15
        };
        
        setHabits(prev => [newHabit, ...prev]);
        toast.success('Habit added successfully!');
        return;
      }
      
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name,
          user_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const newHabit: Habit = {
          id: data.id,
          name: data.name,
          streak: data.streak,
          completedDates: [],
          points: 15
        };
        
        setHabits(prev => [newHabit, ...prev]);
        toast.success('Habit added successfully!');
      }
    } catch (error) {
      console.error('Error adding habit:', error);
      toast.error('Failed to add habit. Please try again.');
    }
  };

  const toggleHabit = async (id: number) => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Find the habit
      const habit = habits.find(h => h.id === id);
      if (!habit) return;
      
      const alreadyCompleted = habit.completedDates.includes(today);
      let newCompletedDates: string[];
      let newStreak: number;
      
      if (alreadyCompleted) {
        // Remove today's completion
        newCompletedDates = habit.completedDates.filter(date => date !== today);
        newStreak = Math.max(0, habit.streak - 1);
        
        // Delete from database if not using mock client
        if (!isMockClient()) {
          await supabase
            .from('habit_completions')
            .delete()
            .eq('habit_id', id)
            .eq('completion_date', today)
            .eq('user_id', user.id);
        }
          
        // Remove points
        await addPoints(-15);
        
        const newHabitsCompleted = Math.max(0, userStats.habitsCompleted - 1);
        setUserStats(prev => ({
          ...prev,
          habitsCompleted: newHabitsCompleted
        }));
        
        if (!isMockClient()) {
          await supabase
            .from('user_stats')
            .update({
              habits_completed: newHabitsCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
          
        // Update achievements
        setUserStats(prev => ({
          ...prev,
          achievements: prev.achievements.map(achievement => {
            if (achievement.id === 2) { // Habit Former achievement
              return {
                ...achievement,
                progress: newStreak,
                completed: newStreak >= achievement.maxProgress
              };
            }
            return achievement;
          })
        }));
      } else {
        // Add today's completion
        newCompletedDates = [...habit.completedDates, today];
        newStreak = habit.streak + 1;
        
        // Add to database if not using mock client
        if (!isMockClient()) {
          await supabase
            .from('habit_completions')
            .insert({
              habit_id: id,
              completion_date: today,
              user_id: user.id
            });
        }
          
        // Add points
        await addPoints(15);
        
        const newHabitsCompleted = userStats.habitsCompleted + 1;
        const newLongestStreak = Math.max(userStats.longestStreak, newStreak);
        
        setUserStats(prev => ({
          ...prev,
          habitsCompleted: newHabitsCompleted,
          longestStreak: newLongestStreak,
          streak: Math.max(prev.streak, newStreak)
        }));
        
        if (!isMockClient()) {
          await supabase
            .from('user_stats')
            .update({
              habits_completed: newHabitsCompleted,
              longest_streak: newLongestStreak,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
          
        // Update achievements
        setUserStats(prev => ({
          ...prev,
          achievements: prev.achievements.map(achievement => {
            if (achievement.id === 2) { // Habit Former achievement
              return {
                ...achievement,
                progress: newLongestStreak,
                completed: newLongestStreak >= achievement.maxProgress
              };
            }
            return achievement;
          }),
          challenges: prev.challenges.map(challenge => {
            if (challenge.id === 3) { // Habit Streak Challenge
              const newProgress = Math.min(challenge.progress + 1, challenge.goal);
              return {
                ...challenge,
                progress: newProgress,
                completed: newProgress >= challenge.goal
              };
            }
            return challenge;
          })
        }));
      }
      
      // Update habit streak in database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('habits')
          .update({ streak: newStreak })
          .eq('id', id)
          .eq('user_id', user.id);
      }
        
      // Update local state
      setHabits(
        habits.map(habit => {
          if (habit.id === id) {
            return {
              ...habit,
              completedDates: newCompletedDates,
              streak: newStreak,
            };
          }
          return habit;
        })
      );
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  const deleteHabit = async (id: number) => {
    if (!user) return;
    
    try {
      // Check if the habit was completed today before deleting
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === id);
      if (!habit) return;
      
      // Update local state
      setHabits(habits.filter(habit => habit.id !== id));
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('habits')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }
        
      // Update stats if habit was completed today
      if (habit.completedDates.includes(today)) {
        // Remove points for today's completion
        await addPoints(-15);
        
        const newHabitsCompleted = Math.max(0, userStats.habitsCompleted - 1);
        setUserStats(prev => ({
          ...prev,
          habitsCompleted: newHabitsCompleted
        }));
        
        if (!isMockClient()) {
          await supabase
            .from('user_stats')
            .update({
              habits_completed: newHabitsCompleted,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        }
      }
      
      toast.success('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit. Please try again.');
    }
  };

  const completeFocusSession = async () => {
    if (!user) return;
    
    try {
      // Add points for completing a focus session
      await addPoints(20);
      
      const newFocusSessionsCompleted = userStats.focusSessionsCompleted + 1;
      setUserStats(prev => ({
        ...prev,
        focusSessionsCompleted: newFocusSessionsCompleted,
        achievements: prev.achievements.map(achievement => {
          if (achievement.id === 3) { // Focus Champion achievement
            const newProgress = Math.min(achievement.progress + 1, achievement.maxProgress);
            return {
              ...achievement,
              progress: newProgress,
              completed: newProgress >= achievement.maxProgress
            };
          }
          return achievement;
        }),
        challenges: prev.challenges.map(challenge => {
          if (challenge.id === 2) { // Focus Week Challenge
            const newProgress = Math.min(challenge.progress + 1, challenge.goal);
            return {
              ...challenge,
              progress: newProgress,
              completed: newProgress >= challenge.goal
            };
          }
          return challenge;
        })
      }));
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('user_stats')
          .update({
            focus_sessions_completed: newFocusSessionsCompleted,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
        
      toast.success('Focus session completed! +20 points');
    } catch (error) {
      console.error('Error completing focus session:', error);
    }
  };

  const updateSettings = async (newSettings: AppSettings) => {
    if (!user) return;
    
    try {
      // Update local state
      setSettings(newSettings);
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('user_settings')
          .update({
            theme: newSettings.theme,
            notifications: newSettings.notifications,
            focus_time: newSettings.focusTime,
            short_break: newSettings.shortBreak,
            long_break: newSettings.longBreak,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
        
      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings. Please try again.');
    }
  };

  // Achievement functions
  const claimAchievement = async (id: number) => {
    if (!user) return;
    
    try {
      // Find the achievement
      const achievement = userStats.achievements.find(a => a.id === id);
      if (!achievement || !achievement.completed || achievement.completedAt) return;
      
      // Update local state
      setUserStats(prev => {
        const newAchievements = prev.achievements.map(a => {
          if (a.id === id) {
            return {
              ...a,
              completedAt: new Date().toISOString()
            };
          }
          return a;
        });
        
        return {
          ...prev,
          achievements: newAchievements
        };
      });
      
      // Add points for the achievement
      await addPoints(achievement.reward);
      
      toast.success(`Achievement claimed! +${achievement.reward} points`);
    } catch (error) {
      console.error('Error claiming achievement:', error);
      toast.error('Failed to claim achievement. Please try again.');
    }
  };

  // Challenge functions
  const joinChallenge = async (id: number) => {
    if (!user) return;
    
    try {
      // Find the challenge
      const challenge = userStats.challenges.find(c => c.id === id);
      if (!challenge) return;
      
      // Update local state to mark the challenge as joined
      setUserStats(prev => ({
        ...prev,
        challenges: prev.challenges.map(c => {
          if (c.id === id) {
            return {
              ...c,
              joined: true
            };
          }
          return c;
        })
      }));
      
      toast.success(`Joined challenge: ${challenge.name}`);
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error('Failed to join challenge. Please try again.');
    }
  };

  const claimChallenge = async (id: number) => {
    if (!user) return;
    
    try {
      // Find the challenge
      const challenge = userStats.challenges.find(c => c.id === id);
      if (!challenge || !challenge.completed) return;
      
      // Update local state
      setUserStats(prev => ({
        ...prev,
        challenges: prev.challenges.map(c => {
          if (c.id === id) {
            return {
              ...c,
              claimed: true
            };
          }
          return c;
        })
      }));
      
      // Add points for the challenge
      await addPoints(challenge.reward);
      
      toast.success(`Challenge reward claimed! +${challenge.reward} points`);
    } catch (error) {
      console.error('Error claiming challenge reward:', error);
      toast.error('Failed to claim challenge reward. Please try again.');
    }
  };

  // Reward functions
  const claimReward = async (id: number) => {
    if (!user) return;
    
    try {
      // Find the reward
      const reward = userStats.rewards.find(r => r.id === id);
      if (!reward || !reward.unlocked || reward.claimed) return;
      
      // Check if user has enough points
      if (userStats.points < reward.cost) {
        toast.error(`Not enough points to claim this reward. You need ${reward.cost} points.`);
        return;
      }
      
      // Update local state
      setUserStats(prev => ({
        ...prev,
        rewards: prev.rewards.map(r => {
          if (r.id === id) {
            return {
              ...r,
              claimed: true
            };
          }
          return r;
        }),
        points: prev.points - reward.cost
      }));
      
      // Update database if not using mock client
      if (!isMockClient()) {
        await supabase
          .from('user_stats')
          .update({
            points: userStats.points - reward.cost,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      }
      
      toast.success(`Reward claimed: ${reward.name}`);
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward. Please try again.');
    }
  };

  // Add new method for getting productivity insights
  const getProductivityInsights = async (): Promise<AIInsight[]> => {
    if (!user) return [];
    
    try {
      const taskPatterns = analyzeTaskPatterns(tasks);
      const habitStreaks = analyzeHabitStreaks(habits);
      const focusStats = analyzeFocusSessionStats(userStats);
      
      const prompt = `
        Analyze user productivity data:
        Task Patterns: ${JSON.stringify(taskPatterns)}
        Habit Streaks: ${JSON.stringify(habitStreaks)}
        Focus Stats: ${JSON.stringify(focusStats)}
        
        Generate actionable insights focusing on:
        1. Productivity trends
        2. Areas for improvement
        3. Success patterns
        4. Potential bottlenecks
        5. Optimization opportunities
        
        Provide structured insights with confidence scores and specific action items.
      `;

      return await aiService.generateInsights(prompt);
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  };

  // Add priority scoring method
  const getPriorityScore = (task: Task): number => {
    const weights = {
      dueDate: 0.4,
      priority: 0.3,
      complexity: 0.2,
      dependencies: 0.1
    };

    let score = 0;
    
    // Due date scoring
    if (task.dueDate) {
      const daysUntilDue = calculateDaysUntilDue(task.dueDate);
      score += weights.dueDate * (1 - Math.min(daysUntilDue / 14, 1));
    }

    // Priority scoring
    const priorityScores = { high: 1, medium: 0.6, low: 0.3 };
    score += weights.priority * (priorityScores[task.priority || 'medium']);

    // Complexity scoring (based on subtasks or description length)
    const complexityScore = calculateComplexityScore(task);
    score += weights.complexity * complexityScore;

    // Dependencies scoring
    const dependencyScore = calculateDependencyScore(task);
    score += weights.dependencies * dependencyScore;

    return Math.round(score * 100) / 100;
  };

  // Fix getHabitRecommendations implementation
  const getHabitRecommendations = async (): Promise<string[]> => {
    return [
      'Morning meditation',
      'Daily exercise',
      'Reading for 30 minutes'
    ];
  };

  // Fix the optimizeSchedule implementation
  const optimizeSchedule = async (): Promise<void> => {
    try {
      const schedule = await aiService.analyze('optimize schedule');
      
      // Apply the optimized schedule
      const updatedTasks = tasks.map(task => ({
        ...task,
        priority: schedule.priority,
        dueDate: schedule.deadline
      }));
      
      setTasks(updatedTasks);
      toast.success('Schedule optimized successfully');
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      toast.error('Failed to optimize schedule');
    }
  };

  // Update DataProvider value
  return (
    <DataContext.Provider value={{ 
      tasks, 
      habits, 
      userStats, 
      settings, 
      loading,
      addTask,
      toggleTask,
      deleteTask,
      editTask,
      addHabit,
      toggleHabit,
      deleteHabit,
      completeFocusSession,
      updateSettings,
      claimAchievement,
      joinChallenge,
      claimChallenge,
      claimReward,
      analyzeTask: analyzeTaskContent,
      getProductivityInsights,
      getPriorityScore,
      optimizeSchedule,
      getHabitRecommendations
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Add new helper function for AI analysis
const analyzeTaskContent = async (text: string): Promise<AIAnalysis> => {
  try {
    const prompt = `
      Analyze this task: "${text}"
      
      Consider:
      1. Urgency and importance (Eisenhower Matrix)
      2. Task complexity and required effort
      3. Dependencies and prerequisites
      4. Impact on overall goals
      5. Resource requirements
      
      Provide structured analysis with:
      - Priority level
      - Confidence score (0-1)
      - Detailed reasoning
      - Suggested deadline
      - Potential subtasks
      - Estimated duration (minutes)
      - Relevant tags
    `;

    // Your AI service call here
    const response = await aiService.analyze(prompt);
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      reasoning: response.reasoning,
      suggestedDeadline: response.deadline,
      subtasks: response.subtasks,
      estimatedDuration: response.duration,
      tags: response.tags
    };
  } catch (error) {
    console.error('Error analyzing task:', error);
    throw new Error('Failed to analyze task content');
  }
};