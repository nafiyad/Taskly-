export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: number
          created_at: string
          text: string
          completed: boolean
          user_id: string
          due_date?: string
          priority?: string
          notes?: string
        }
        Insert: {
          id?: number
          created_at?: string
          text: string
          completed?: boolean
          user_id: string
          due_date?: string
          priority?: string
          notes?: string
        }
        Update: {
          id?: number
          created_at?: string
          text?: string
          completed?: boolean
          user_id?: string
          due_date?: string
          priority?: string
          notes?: string
        }
      }
      habits: {
        Row: {
          id: number
          created_at: string
          name: string
          streak: number
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          streak?: number
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          streak?: number
          user_id?: string
        }
      }
      habit_completions: {
        Row: {
          id: number
          created_at: string
          habit_id: number
          completion_date: string
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          habit_id: number
          completion_date: string
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          habit_id?: number
          completion_date?: string
          user_id?: string
        }
      }
      user_stats: {
        Row: {
          id: number
          user_id: string
          points: number
          level: number
          tasks_completed: number
          habits_completed: number
          focus_sessions_completed: number
          longest_streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          points?: number
          level?: number
          tasks_completed?: number
          habits_completed?: number
          focus_sessions_completed?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          points?: number
          level?: number
          tasks_completed?: number
          habits_completed?: number
          focus_sessions_completed?: number
          longest_streak?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_badges: {
        Row: {
          id: number
          user_id: string
          badge_id: number
          earned_at: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          badge_id: number
          earned_at: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          badge_id?: number
          earned_at?: string
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: number
          name: string
          description: string
          icon: string
          requirement_type: string
          requirement_count: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          icon: string
          requirement_type: string
          requirement_count: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          icon?: string
          requirement_type?: string
          requirement_count?: number
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: number
          user_id: string
          theme: string
          notifications: boolean
          focus_time: number
          short_break: number
          long_break: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          theme?: string
          notifications?: boolean
          focus_time?: number
          short_break?: number
          long_break?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          theme?: string
          notifications?: boolean
          focus_time?: number
          short_break?: number
          long_break?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}