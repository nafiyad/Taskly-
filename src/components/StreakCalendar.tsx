import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';

interface StreakCalendarProps {
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ 
  completedDates, 
  currentStreak, 
  longestStreak 
}) => {
  // Generate dates for the current month
  const getDaysInMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      days.push({
        date: dateString,
        day: i,
        isToday: i === today.getDate(),
        isCompleted: completedDates.includes(dateString),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      });
    }
    
    return days;
  };
  
  const days = getDaysInMonth();
  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });
  
  // Get day names for the header (Sun, Mon, etc.)
  const getDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames;
  };
  
  // Get the day of the week for the first day of the month (0-6)
  const getFirstDayOfMonth = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    return new Date(year, month, 1).getDay();
  };
  
  const dayNames = getDayNames();
  const firstDayOfMonth = getFirstDayOfMonth();
  
  // Create empty cells for days before the first day of the month
  const emptyCells = Array(firstDayOfMonth).fill(null).map((_, index) => (
    <div key={`empty-${index}`} className="h-8 w-8"></div>
  ));
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-600 mr-2 dark:text-blue-400" />
          <h3 className="font-medium text-gray-800 dark:text-white">{monthName} Streak Calendar</h3>
        </div>
        <div className="flex space-x-4">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Current: </span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{currentStreak} days</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Best: </span>
            <span className="font-medium text-purple-600 dark:text-purple-400">{longestStreak} days</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-xs text-center font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyCells}
        {days.map(day => (
          <div 
            key={day.date} 
            className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${
              day.isToday 
                ? 'bg-blue-100 text-blue-800 font-medium dark:bg-blue-900 dark:text-blue-300' 
                : day.isCompleted 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : day.isPast 
                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                    : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {day.isCompleted ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              day.day
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-100 mr-1 dark:bg-green-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-100 mr-1 dark:bg-blue-900"></div>
          <span className="text-gray-600 dark:text-gray-400">Today</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-50 mr-1 dark:bg-red-900/20"></div>
          <span className="text-gray-600 dark:text-gray-400">Missed</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;