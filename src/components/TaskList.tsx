import React, { useState } from 'react';
import { Check, Trash, Edit, X, Save, Award, Calendar, Flag, AlignLeft, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, newText: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, deleteTask, editTask }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high' | ''>('');
  const [editNotes, setEditNotes] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditDueDate(task.dueDate || '');
    setEditPriority(task.priority || '');
    setEditNotes(task.notes || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
    setEditDueDate('');
    setEditPriority('');
    setEditNotes('');
  };

  const saveEdit = (id: number) => {
    if (editText.trim()) {
      editTask(
        id, 
        editText, 
        editDueDate || undefined, 
        editPriority || undefined, 
        editNotes || undefined
      );
      setEditingId(null);
      setEditText('');
      setEditDueDate('');
      setEditPriority('');
      setEditNotes('');
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedTaskId === id) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(id);
    }
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'high':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const getPriorityLabel = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return 'None';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    return taskDate < today;
  };

  // Extract categories from tasks
  const extractCategories = () => {
    const categories = new Set<string>();
    
    tasks.forEach(task => {
      if (task.notes && task.notes.startsWith('Category:')) {
        const category = task.notes.replace('Category:', '').trim();
        categories.add(category);
      } else {
        categories.add('Uncategorized');
      }
    });
    
    return Array.from(categories);
  };

  const categories = extractCategories();

  // Filter tasks by category
  const getTasksByCategory = (category: string | null) => {
    if (!category) {
      return tasks;
    }
    
    return tasks.filter(task => {
      if (category === 'Uncategorized') {
        return !task.notes || !task.notes.startsWith('Category:');
      }
      
      return task.notes && task.notes.startsWith(`Category: ${category}`);
    });
  };

  // Sort tasks: first by completion status, then by due date, then by priority
  const sortedTasks = [...getTasksByCategory(activeCategory)].sort((a, b) => {
    // Completed tasks go to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by due date (tasks with due dates come first)
    if (!!a.dueDate !== !!b.dueDate) {
      return a.dueDate ? -1 : 1;
    }
    
    // Sort by due date (earlier dates first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2, undefined: 3 };
    const aPriority = a.priority || 'undefined';
    const bPriority = b.priority || 'undefined';
    
    return priorityOrder[aPriority as keyof typeof priorityOrder] - 
           priorityOrder[bPriority as keyof typeof priorityOrder];
  });

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeCategory === null
                  ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeCategory === category
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {category} ({getTasksByCategory(category).length})
              </button>
            ))}
          </div>
        </div>
      )}
      
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedTasks.map((task) => (
          <li key={task.id} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-700">
            <div className="px-4 py-3">
              <div className="flex items-center">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 h-5 w-5 rounded border ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  } flex items-center justify-center mr-3`}
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed && <Check className="h-4 w-4" />}
                </button>

                {editingId === task.id ? (
                  <div className="flex-1 flex items-center">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      autoFocus
                    />
                    <div className="flex ml-2">
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="text-green-600 hover:text-green-800 p-1 dark:text-green-400 dark:hover:text-green-300"
                        aria-label="Save changes"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-600 hover:text-gray-800 p-1 ml-1 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Cancel editing"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span
                          className={`flex-1 ${
                            task.completed ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {task.text}
                        </span>
                        
                        <div className="flex items-center ml-2 space-x-2">
                          {task.priority && (
                            <span className={`flex items-center text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              <Flag className="h-3 w-3 mr-1" />
                              {getPriorityLabel(task.priority)}
                            </span>
                          )}
                          
                          {task.dueDate && (
                            <span className={`flex items-center text-xs font-medium ${
                              isOverdue(task.dueDate) && !task.completed 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`}>
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                          
                          {task.points && (
                            <span className="flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-400">
                              <Award className="h-3 w-3 mr-1" />
                              {task.points} pts
                            </span>
                          )}
                          
                          {(task.notes || task.dueDate || task.priority) && (
                            <button
                              onClick={() => toggleExpand(task.id)}
                              className="text-gray-500 hover:text-gray-700 p-1 dark:text-gray-400 dark:hover:text-gray-300"
                              aria-label={expandedTaskId === task.id ? "Collapse details" : "Expand details"}
                            >
                              {expandedTaskId === task.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {expandedTaskId === task.id && (
                        <div className="mt-2 pl-1 text-sm text-gray-600 dark:text-gray-300">
                          {task.dueDate && (
                            <div className="mb-1 flex items-start">
                              <Calendar className="h-4 w-4 mr-2 mt-0.5" />
                              <div>
                                <span className="font-medium">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
                                {isOverdue(task.dueDate) && !task.completed && (
                                  <span className="ml-2 text-red-600 dark:text-red-400 font-medium">Overdue</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {task.priority && (
                            <div className="mb-1 flex items-start">
                              <Flag className={`h-4 w-4 mr-2 mt-0.5 ${getPriorityColor(task.priority)}`} />
                              <div>
                                <span className="font-medium">Priority:</span> {getPriorityLabel(task.priority)}
                              </div>
                            </div>
                          )}
                          
                          {task.notes && (
                            <div className="mb-1 flex items-start">
                              <AlignLeft className="h-4 w-4 mr-2 mt-0.5" />
                              <div>
                                <span className="font-medium">Notes:</span> {task.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex ml-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="text-gray-500 hover:text-gray-700 p-1 dark:text-gray-400 dark:hover:text-gray-300"
                        aria-label="Edit task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 p-1 ml-1 dark:text-red-400 dark:hover:text-red-300"
                        aria-label="Delete task"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {editingId === task.id && (
              <div className="px-4 pb-3 pl-11">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
                      Priority
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high' | '')}
                      className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">None</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={2}
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;