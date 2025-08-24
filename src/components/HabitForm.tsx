import React, { useState, memo } from 'react';
import { Plus, Lock } from 'lucide-react';

interface HabitFormProps {
  addHabit: (name: string) => void;
  isAtLimit?: boolean;
}

// Using memo to prevent unnecessary re-renders
const HabitForm: React.FC<HabitFormProps> = memo(({ addHabit, isAtLimit = false }) => {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitName.trim() && !isAtLimit) {
      addHabit(habitName.trim());
      setHabitName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder={isAtLimit ? "Upgrade to Pro for unlimited habits" : "Add a new habit to track..."}
          className="flex-1 px-4 py-3 focus:outline-none dark:bg-gray-800 dark:text-white"
          disabled={isAtLimit}
        />
        <button
          type="submit"
          disabled={isAtLimit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 flex items-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAtLimit ? (
            <Lock className="h-5 w-5 mr-1" />
          ) : (
            <Plus className="h-5 w-5 mr-1" />
          )}
          <span>{isAtLimit ? 'Upgrade' : 'Add Habit'}</span>
        </button>
      </div>
    </form>
  );
});

// Add display name for debugging
HabitForm.displayName = 'HabitForm';

export default HabitForm;