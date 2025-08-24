import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Calendar, Clock, Award, Zap, Trophy } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">Taskly</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            by <span className="font-cursive italic text-lg">Nafiyad</span>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-white">
              {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text- sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
              >
                {isLogin ? 'Create a new account' : 'Sign in to existing account'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Task Management</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Organize your tasks, set priorities, and track your progress with our intuitive task management system.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 dark:bg-green-900 dark:text-green-300">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Habit Tracker</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Build consistent habits and track your streaks to develop positive routines that stick.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 dark:bg-purple-900 dark:text-purple-300">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Focus Mode</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Boost productivity with our Pomodoro timer and ambient sounds to help you stay focused.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4 dark:bg-yellow-900 dark:text-yellow-300">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Gamification</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Earn points, level up, and unlock badges as you complete tasks and build habits.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4 dark:bg-red-900 dark:text-red-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Insights</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized insights and statistics to understand your productivity patterns.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4 dark:bg-indigo-900 dark:text-indigo-300">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Achievements</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Track your progress and celebrate your achievements with our reward system.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Taskly by <span className="font-cursive italic text-lg">Nafiyad</span> &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Auth;