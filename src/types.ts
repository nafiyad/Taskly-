export interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  points?: number;
}

export interface Habit {
  id: number;
  name: string;
  streak: number;
  completedDates: string[];
  points?: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  requirement: {
    type: 'tasks' | 'habits' | 'focus' | 'level';
    count: number;
  };
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: string;
  category: 'daily' | 'weekly' | 'special' | 'milestone';
  reward: number;
}

export interface Challenge {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  progress: number;
  completed: boolean;
  reward: number;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  icon: string;
  unlocked: boolean;
  claimed: boolean;
}

export interface UserStats {
  points: number;
  level: number;
  tasksCompleted: number;
  habitsCompleted: number;
  focusSessionsCompleted: number;
  longestStreak: number;
  badges: Badge[];
  achievements: Achievement[];
  challenges: Challenge[];
  rewards: Reward[];
  streak: number;
  lastActive?: string;
  experience: number;
  experienceToNextLevel: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  focusTime: number;
  shortBreak: number;
  longBreak: number;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  timerMode: 'focus' | 'shortBreak' | 'longBreak';
  sessionCount: number;
  soundOn: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  plan: 'free' | 'pro';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface FeatureLimit {
  tasks: number;
  habits: number;
  focusSessions: number;
  challenges: number;
  themes: boolean;
  aiFeatures: boolean;
  dataExport: boolean;
  prioritySupport: boolean;
}