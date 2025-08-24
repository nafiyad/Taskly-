import React, { useState } from 'react';
import { Plus, Calendar, AlignLeft, Flag, Tag, Lock } from 'lucide-react';

interface TaskFormProps {
  addTask: (text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
  isAtLimit?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask, isAtLimit = false }) => {
  const [taskText, setTaskText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Load saved categories from localStorage
  React.useEffect(() => {
    const savedCategories = localStorage.getItem('taskCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save categories to localStorage when they change
  React.useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('taskCategories', JSON.stringify(categories));
    }
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim() && !isAtLimit) {
      // Prepare notes with category if selected
      let finalNotes = notes.trim();
      if (category) {
        finalNotes = `Category: ${category}${finalNotes ? '\n\n' + finalNotes : ''}`;
      }
      
      addTask(
        taskText.trim(), 
        dueDate || undefined, 
        priority || undefined, 
        finalNotes || undefined
      );
      
      setTaskText('');
      setDueDate('');
      setPriority('');
      setNotes('');
      // Keep the category selected for consecutive tasks
      setShowDetails(false);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setCategory(newCategory.trim());
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder={isAtLimit ? "Upgrade to Pro for unlimited tasks" : "Add a new task..."}
            className="flex-1 px-4 py-3 focus:outline-none dark:bg-gray-800 dark:text-white"
            disabled={isAtLimit}
          />
          <button
            type="button"
            onClick={toggleDetails}
            className="px-3 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Toggle task details"
            disabled={isAtLimit}
          >
            {showDetails ? 'Hide Details' : 'Add Details'}
          </button>
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
            <span>{isAtLimit ? 'Upgrade' : 'Add Task'}</span>
          </button>
        </div>
        
        {showDetails && !isAtLimit && (
          <div className="border-t border-gray-200 p-4 space-y-4 dark:border-gray-700">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                <Tag className="inline-block h-4 w-4 mr-1" />
                Category
              </label>
              <div className="flex items-center">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setShowNewCategoryInput(true);
                    } else {
                      setCategory(e.target.value);
                      setShowNewCategoryInput(false);
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
              </div>
              
              {showNewCategoryInput && (
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                Due Date
              </label>
              <input
                type="date"
                id="due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                <Flag className="inline-block h-4 w-4 mr-1" />
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                <AlignLeft className="inline-block h-4 w-4 mr-1" />
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add notes..."
              ></textarea>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default TaskForm;