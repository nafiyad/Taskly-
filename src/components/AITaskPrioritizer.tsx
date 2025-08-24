import React, { useState } from 'react';
import { ListFilter, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { generateCompletion, Message } from '../lib/deepseek';
import { Task } from '../types';
import toast from 'react-hot-toast';

interface AITaskPrioritizerProps {
  tasks: Task[];
  editTask: (id: number, text: string, dueDate?: string, priority?: 'low' | 'medium' | 'high', notes?: string) => void;
}

const AITaskPrioritizer: React.FC<AITaskPrioritizerProps> = ({ tasks, editTask }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const prioritizeTasks = async () => {
    if (tasks.length === 0 || tasks.every(t => t.completed)) {
      toast.error('No active tasks to prioritize');
      return;
    }

    if (tasks.length > 5 && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setLoading(true);
    setShowConfirmation(false);
    
    try {
      // Only prioritize incomplete tasks
      const incompleteTasks = tasks.filter(t => !t.completed);
      
      // Create a task list for the AI with more context
      const taskList = incompleteTasks.map(task => ({
        id: task.id,
        text: task.text,
        dueDate: task.dueDate,
        priority: task.priority,
        notes: task.notes,
        // Add more context for better prioritization
        isOverdue: task.dueDate ? new Date(task.dueDate) < new Date() : false,
        daysUntilDue: task.dueDate ? 
          Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
      }));
      
      const prompt = `
        I need to prioritize these tasks using advanced productivity principles:
        ${JSON.stringify(taskList, null, 2)}
        
        Please analyze these tasks and assign each one a priority level (high, medium, or low) based on:
        1. Due dates (tasks due sooner should generally be higher priority)
        2. Task complexity and importance (based on the task description)
        3. Any notes that might indicate importance
        4. Whether the task is overdue
        5. The Eisenhower Matrix (urgent vs. important)
        
        For each task, provide:
        1. The recommended priority level
        2. A brief explanation of why you assigned that priority
        
        Return a JSON array with objects containing the task id, the recommended priority level, and the explanation.
        Format: [{"id": 123, "priority": "high", "explanation": "Due tomorrow and contains urgent keywords"}, ...]
      `;
      
      const messages: Message[] = [
        { role: 'system', content: 'You are an advanced productivity assistant that helps users prioritize their tasks effectively using proven productivity frameworks.' },
        { role: 'user', content: prompt }
      ];
      
      const response = await generateCompletion(messages, { temperature: 0.3 });
      
      try {
        // Extract JSON from the response (handling potential text before/after the JSON)
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('No valid JSON found in response');
        
        const priorityData = JSON.parse(jsonMatch[0]);
        
        if (!Array.isArray(priorityData)) throw new Error('Response is not an array');
        
        // Apply the priorities
        let updatedCount = 0;
        let explanations: string[] = [];
        
        for (const item of priorityData) {
          if (item.id && item.priority) {
            const task = tasks.find(t => t.id === item.id);
            if (task) {
              await editTask(
                item.id, 
                task.text, 
                task.dueDate, 
                item.priority as 'low' | 'medium' | 'high', 
                task.notes
              );
              updatedCount++;
              
              if (item.explanation) {
                explanations.push(`"${task.text}": ${item.explanation}`);
              }
            }
          }
        }
        
        // Show toast with more detailed information
        toast.success(
          <div>
            <p className="font-bold">AI prioritized {updatedCount} tasks</p>
            {explanations.length > 0 && (
              <ul className="mt-2 text-sm list-disc pl-4">
                {explanations.slice(0, 3).map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))}
                {explanations.length > 3 && <li>...and {explanations.length - 3} more</li>}
              </ul>
            )}
          </div>,
          { duration: 5000 }
        );
      } catch (error) {
        console.error('Error parsing AI response:', error, response);
        toast.error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Error prioritizing tasks:', error);
      toast.error('Failed to prioritize tasks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={prioritizeTasks}
        disabled={loading || tasks.length === 0 || tasks.every(t => t.completed)}
        className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-800"
      >
        {loading ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2" />
        )}
        AI Prioritize
      </button>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md dark:bg-gray-800">
            <div className="flex items-center text-amber-500 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Prioritize {tasks.filter(t => !t.completed).length} tasks? </h3>
            </div>
            <p className="text-gray-600 mb-4 dark:text-gray-300">
              You're about to prioritize a large number of tasks. The AI will analyze each task and assign priorities based on due dates, content, and importance.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={prioritizeTasks}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AITaskPrioritizer;