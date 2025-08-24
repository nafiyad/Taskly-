import React, { useState, useRef, useEffect } from 'react';
import { Send, ListTodo, Plus, Trash, MessageCircle, Sparkles, CheckCircle, Filter, Download } from 'lucide-react';
import { generateCompletion, Message } from '../lib/deepseek';
import toast from 'react-hot-toast';
import { useData } from '../contexts/DataContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TaskItem {
  id: number;
  name: string;
  category: string;
  added: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  notes?: string;
}

const ChatAssistant: React.FC = () => {
  const { addTask } = useData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you create task lists, grocery lists, workout plans, and more. Try asking something like "Create a healthy grocery list" or "Make a workout plan for beginners".',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  const [showTaskList, setShowTaskList] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatMessages: Message[] = [
        { 
          role: 'system', 
          content: `You are a powerful AI assistant that specializes in creating detailed, well-organized lists for any purpose. 
          You can create grocery lists, meal plans, workout routines, travel checklists, reading lists, and task lists.
          When users ask for any type of list, provide a comprehensive, structured response organized by logical categories.
          Format your response so it can be easily parsed into a list with categories and items.
          Be comprehensive and thorough in your suggestions, covering all aspects of the user's request.
          For each item, consider if it should have high, medium, or low priority.` 
        },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user', content: input }
      ];

      const response = await generateCompletion(chatMessages, { temperature: 0.7 });

      // Add assistant response to messages
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Extract task items from the response
      const extractedItems = extractTaskItems(response);
      if (extractedItems.length > 0) {
        setTaskItems(extractedItems);
        setShowTaskList(true);
        setActiveCategory(null);
        toast.success(`${extractedItems.length} items identified!`);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const extractTaskItems = (text: string): TaskItem[] => {
    const items: TaskItem[] = [];
    let currentCategory = 'General Items';
    let itemId = 1;

    // Look for category headers and list items
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check if this is a category header
      if (trimmedLine.endsWith(':') || 
          /^#+\s+(.+)/.test(trimmedLine) ||
          (trimmedLine.length < 40 && 
           trimmedLine === trimmedLine.toUpperCase() && 
           !trimmedLine.startsWith('-') && 
           !trimmedLine.startsWith('*'))) {
        currentCategory = trimmedLine.replace(/^#+\s+|:$/g, '').trim();
        continue;
      }
      
      // Check if this is a list item (starts with -, *, or number.)
      const listItemMatch = trimmedLine.match(/^[-*•]|\d+\.\s+(.+)/);
      if (listItemMatch || (trimmedLine.length > 0 && trimmedLine.length < 100)) {
        const itemText = listItemMatch ? 
          trimmedLine.replace(/^[-*•]|\d+\.\s+/, '').trim() : 
          trimmedLine;
        
        if (itemText && !itemText.includes('http') && itemText.length < 100) {
          // Try to detect priority from the text
          let priority: 'low' | 'medium' | 'high' | undefined = undefined;
          let itemName = itemText;
          
          if (itemText.includes('(high priority)') || itemText.includes('(urgent)')) {
            priority = 'high';
            itemName = itemText.replace(/\(high priority\)|\(urgent\)/gi, '').trim();
          } else if (itemText.includes('(medium priority)')) {
            priority = 'medium';
            itemName = itemText.replace(/\(medium priority\)/gi, '').trim();
          } else if (itemText.includes('(low priority)')) {
            priority = 'low';
            itemName = itemText.replace(/\(low priority\)/gi, '').trim();
          }
          
          // Check for due dates in the format (due: date)
          let dueDate: string | undefined = undefined;
          const dueDateMatch = itemName.match(/\(due:?\s*([^)]+)\)/i);
          if (dueDateMatch) {
            const dateText = dueDateMatch[1].trim();
            // Try to parse the date
            try {
              const parsedDate = new Date(dateText);
              if (!isNaN(parsedDate.getTime())) {
                dueDate = parsedDate.toISOString().split('T')[0];
                itemName = itemName.replace(/\(due:?\s*([^)]+)\)/i, '').trim();
              }
            } catch (e) {
              // Invalid date format, ignore
            }
          }
          
          items.push({
            id: itemId++,
            name: itemName,
            category: currentCategory,
            added: false,
            priority,
            dueDate
          });
        }
      }
    }

    return items;
  };

  const addToTaskList = (item: TaskItem) => {
    // Add to Taskly's task system
    addTask(
      item.name, 
      item.dueDate, 
      item.priority, 
      item.category !== 'General Items' ? `Category: ${item.category}` : undefined
    );
    
    // Mark as added in our local state
    setTaskItems(prev => 
      prev.map(task => 
        task.id === item.id ? { ...task, added: true } : task
      )
    );
    
    toast.success('Item added to your list!');
  };

  const addAllToTaskList = () => {
    // Get all non-added tasks
    const tasksToAdd = taskItems.filter(item => !item.added);
    
    // Add each task
    tasksToAdd.forEach(item => {
      addTask(
        item.name, 
        item.dueDate, 
        item.priority, 
        item.category !== 'General Items' ? `Category: ${item.category}` : undefined
      );
    });
    
    // Mark all as added
    setTaskItems(prev => 
      prev.map(item => ({ ...item, added: true }))
    );
    
    toast.success(`${tasksToAdd.length} items added to your list!`);
  };

  const clearTaskList = () => {
    setTaskItems([]);
    setShowTaskList(false);
    setActiveCategory(null);
  };

  // Group task items by category
  const groupedItems = taskItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, TaskItem[]>);

  // Get categories and count
  const categories = Object.keys(groupedItems);
  
  // Filter tasks by active category
  const filteredTasks = activeCategory 
    ? groupedItems[activeCategory] || []
    : taskItems;

  // Export tasks as text
  const exportTasks = () => {
    let exportText = "# List\n\n";
    
    Object.entries(groupedItems).forEach(([category, items]) => {
      exportText += `## ${category}\n\n`;
      items.forEach(item => {
        exportText += `- ${item.name}`;
        if (item.priority) exportText += ` (${item.priority} priority)`;
        if (item.dueDate) exportText += ` (due: ${item.dueDate})`;
        exportText += "\n";
      });
      exportText += "\n";
    });
    
    // Create a blob and download
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('List exported!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Chat Assistant</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
            <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                <h2 className="font-medium">AI Assistant</h2>
              </div>
              <div className="flex items-center text-xs">
                <Sparkles className="h-4 w-4 mr-1" />
                <span>AI Powered</span>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for any type of list (grocery, workout, travel, etc.)..."
                  className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Task List Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800">
            <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3">
              <div className="flex items-center">
                <ListTodo className="h-5 w-5 mr-2" />
                <h2 className="font-medium">Item List</h2>
              </div>
              <div className="flex space-x-2">
                {taskItems.length > 0 && (
                  <>
                    <button 
                      onClick={addAllToTaskList}
                      className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1"
                      title="Add all items to your Taskly list"
                    >
                      Add All
                    </button>
                    <button 
                      onClick={exportTasks}
                      className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1"
                      title="Export list as text file"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={clearTaskList}
                      className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1"
                      title="Clear list"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Category filter */}
            {categories.length > 1 && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <Filter className="h-4 w-4 text-gray-500 mr-2 dark:text-gray-400" />
                <select
                  value={activeCategory || ''}
                  onChange={(e) => setActiveCategory(e.target.value || null)}
                  className="text-sm border-none focus:ring-0 py-1 pr-8 pl-1 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category} ({groupedItems[category].length})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="h-96 overflow-y-auto p-4">
              {taskItems.length > 0 ? (
                <div>
                  {activeCategory ? (
                    <div>
                      <ul className="space-y-2">
                        {filteredTasks.map(item => (
                          <TaskItemComponent 
                            key={item.id} 
                            item={item} 
                            onAdd={() => addToTaskList(item)} 
                          />
                        ))}
                      </ul>
                    </div>
                  ) : (
                    Object.entries(groupedItems).map(([category, items]) => (
                      <div key={category} className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2 dark:text-white">{category}</h3>
                        <ul className="space-y-2">
                          {items.map(item => (
                            <TaskItemComponent 
                              key={item.id} 
                              item={item} 
                              onAdd={() => addToTaskList(item)} 
                            />
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <ListTodo className="h-12 w-12 mb-2 opacity-30" />
                  <p className="text-center">
                    Your list is empty. Ask the assistant to create a list for you!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItemComponent: React.FC<{ 
  item: TaskItem; 
  onAdd: () => void; 
}> = ({ item, onAdd }) => {
  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return '';
    }
  };

  return (
    <li 
      className={`flex items-start justify-between p-2 rounded ${
        item.added 
          ? 'bg-green-50 dark:bg-green-900/20' 
          : 'bg-gray-50 dark:bg-gray-700'
      }`}
    >
      <div className="flex-1 mr-2">
        <span className={`text-sm ${item.added ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {item.name}
        </span>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {item.priority && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 ${getPriorityColor(item.priority)}`}>
              {item.priority}
            </span>
          )}
          
          {item.dueDate && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-blue-600 dark:bg-gray-600 dark:text-blue-400">
              due: {item.dueDate}
            </span>
          )}
        </div>
      </div>
      
      {item.added ? (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
      ) : (
        <button
          onClick={onAdd}
          className="text-blue-500 hover:text-blue-700 p-1 flex-shrink-0 dark:text-blue-400 dark:hover:text-blue-300"
          title="Add to your task list"
        >
          <Plus className="h-5 w-5" />
        </button>
      )}
    </li>
  );
};

export default ChatAssistant;