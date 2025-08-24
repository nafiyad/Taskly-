import React, { memo } from 'react';
import { Check, Trash, Award, Zap } from 'lucide-react';
import { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  toggleHabit: (id: number) => void;
  deleteHabit: (id: number) => void;
}

// Using memo to prevent unnecessary re-renders
const HabitList: React.FC<HabitListProps> = memo(({ habits, toggleHabit, deleteHabit }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Generate dates for the last 7 days
  const getDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };
  
  const dates = getDates();
  
  // Format date for display (e.g., "Mon 15")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    return `${day} ${dayNum}`;
  };

  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No habits yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 dark:text-gray-400">
                Habit
              </th>
              {dates.map(date => (
                <th key={date} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  {formatDate(date)}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Streak
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Points
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {habits.map(habit => (
              <tr key={habit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {habit.name}
                </td>
                {dates.map(date => (
                  <td key={date} className="px-2 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => date === today && toggleHabit(habit.id)}
                      className={`h-6 w-6 rounded-full ${
                        habit.completedDates.includes(date)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600'
                      } ${
                        date === today ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-70'
                      } flex items-center justify-center mx-auto`}
                      disabled={date !== today}
                      aria-label={habit.completedDates.includes(date) ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {habit.completedDates.includes(date) && <Check className="h-4 w-4" />}
                    </button>
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Zap className="h-3 w-3 mr-1" />
                    {habit.streak}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Award className="h-3 w-3 mr-1" />
                    {habit.points || 15}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete habit"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// Add display name for debugging
HabitList.displayName = 'HabitList';

export default HabitList;