// DeepSeek AI API integration
// This is a simplified implementation for demonstration purposes

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Mock AI implementation for demonstration
export async function generateCompletion(
  messages: Message[],
  options: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
    contextHistory?: any[];
    userPreferences?: any;
  } = {}
): Promise<string> {
  try {
    // Extract user message for processing
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate appropriate response based on the request type
    if (isGroceryRequest(userMessage)) {
      return generateGroceryList(userMessage);
    } else if (isTaskListRequest(userMessage)) {
      return generateTaskList(userMessage);
    } else if (isProductivityRequest(userMessage)) {
      return generateProductivityAnalysisResponse(userMessage);
    } else {
      return generateGenericList(userMessage);
    }
  } catch (error) {
    console.error('Error in AI processing:', error);
    return 'I encountered an error while processing your request. Please try again.';
  }
}

// Request type detection functions
function isGroceryRequest(text: string): boolean {
  return text.toLowerCase().includes('grocery') || 
         text.toLowerCase().includes('shopping list') ||
         text.toLowerCase().includes('food list');
}

function isTaskListRequest(text: string): boolean {
  return text.toLowerCase().includes('task list') || 
         text.toLowerCase().includes('to-do list') || 
         text.toLowerCase().includes('checklist') ||
         text.toLowerCase().includes('plan for');
}

function isProductivityRequest(text: string): boolean {
  return text.toLowerCase().includes('productivity') ||
         text.toLowerCase().includes('analyze my performance');
}

// Content generation functions
function generateGroceryList(userInput: string): string {
  const isHealthy = userInput.toLowerCase().includes('healthy');
  const isVegan = userInput.toLowerCase().includes('vegan');
  const isKeto = userInput.toLowerCase().includes('keto');
  const isGlutenFree = userInput.toLowerCase().includes('gluten-free') || userInput.toLowerCase().includes('gluten free');
  
  let title = "Grocery List";
  let content = "";
  
  if (isHealthy) {
    title = "Healthy Grocery List";
    content = `# Healthy Grocery List

## Fresh Produce
- Leafy greens (spinach, kale, arugula) (high priority)
- Bell peppers (red, yellow, green)
- Broccoli and cauliflower
- Carrots and cucumbers
- Avocados
- Sweet potatoes
- Berries (blueberries, strawberries, raspberries)
- Apples and bananas

## Proteins
- Boneless, skinless chicken breast
- Wild-caught salmon
- Grass-fed lean beef
- Eggs (preferably organic)
- Greek yogurt

## Grains & Legumes
- Quinoa
- Brown rice
- Oats (steel-cut or rolled)
- Lentils
- Black beans
- Chickpeas
- Whole grain bread`;
  } else if (isVegan) {
    title = "Vegan Grocery List";
    content = `# Vegan Grocery List

## Fresh Produce
- Leafy greens (spinach, kale, swiss chard) (high priority)
- Bell peppers and zucchini
- Broccoli and cauliflower
- Mushrooms
- Sweet potatoes
- Berries and bananas
- Avocados

## Plant Proteins
- Tofu (firm and silken)
- Tempeh
- Seitan
- Lentils (red, green, brown)
- Black beans
- Chickpeas

## Non-Dairy Products
- Almond milk
- Oat milk
- Coconut yogurt
- Vegan cheese`;
  } else if (isKeto) {
    title = "Keto Grocery List";
    content = `# Keto Grocery List

## Proteins
- Grass-fed beef (high priority)
- Chicken thighs with skin
- Bacon (sugar-free)
- Salmon and fatty fish
- Eggs (preferably organic)

## Low-Carb Vegetables
- Leafy greens (spinach, kale, lettuce)
- Broccoli
- Cauliflower
- Zucchini
- Asparagus
- Bell peppers

## Healthy Fats
- Avocados
- Butter (grass-fed)
- Coconut oil
- Extra virgin olive oil
- MCT oil`;
  } else if (isGlutenFree) {
    title = "Gluten-Free Grocery List";
    content = `# Gluten-Free Grocery List

## Proteins
- Chicken (all cuts)
- Beef (all cuts)
- Fish and seafood
- Eggs
- Beans and lentils

## Gluten-Free Grains & Starches
- Rice (all varieties)
- Quinoa
- Millet
- Buckwheat
- Corn (polenta, grits, tortillas)
- Potatoes
- Gluten-free oats (certified)

## Gluten-Free Bread & Baking
- Gluten-free bread (high priority)
- Gluten-free pasta
- Gluten-free flour blend
- Almond flour
- Coconut flour`;
  } else {
    content = `# Grocery List

## Fresh Produce
- Apples
- Bananas
- Berries
- Spinach
- Lettuce
- Tomatoes
- Carrots
- Onions
- Potatoes

## Dairy & Refrigerated
- Milk
- Eggs
- Butter
- Cheese
- Yogurt

## Meat & Seafood
- Chicken breast
- Ground beef
- Salmon
- Bacon

## Pantry Staples
- Bread
- Rice
- Pasta
- Cereal
- Olive oil
- Coffee
- Tea`;
  }
  
  return content;
}

function generateTaskList(userInput: string): string {
  // Extract the topic from the user input
  const topic = extractTopic(userInput);
  
  if (topic.toLowerCase().includes('move') || topic.toLowerCase().includes('moving')) {
    return `# Moving Checklist

## 1-2 Months Before Moving
- Research and hire a moving company (high priority)
- Create a moving budget and start saving
- Begin decluttering and decide what to keep, donate, or sell
- Start collecting free boxes from local stores
- Create a folder for moving-related documents

## 2-3 Weeks Before Moving
- Start packing non-essential items (medium priority)
- Notify important parties of your address change
- Transfer or cancel memberships and subscriptions
- Schedule disconnection of utilities at current home
- Schedule connection of utilities at new home (high priority)

## 1 Week Before Moving
- Confirm details with moving company (high priority)
- Pack a "first night" box with essentials
- Clean your current home
- Disassemble furniture that requires it
- Secure important documents and valuables

## Moving Day
- Do a final walkthrough of your old home (high priority)
- Check all closets, drawers, and cabinets for forgotten items
- Take meter readings at both properties
- Hand over keys to landlord/new owners
- Supervise movers and provide clear directions`;
  } else if (topic.toLowerCase().includes('website') || topic.toLowerCase().includes('web')) {
    return `# Website Launch Project Plan

## Planning Phase
- Define website purpose and goals (high priority)
- Identify target audience
- Create a project timeline with milestones (due: this week)
- Establish budget constraints
- Research competitors' websites

## Design Phase
- Create site map and user flow diagrams
- Design wireframes for key pages (medium priority)
- Develop brand style guide (colors, typography, etc.)
- Create mockups for desktop and mobile versions
- Get client/stakeholder approval on designs

## Development Phase
- Set up development environment
- Develop responsive HTML/CSS templates
- Implement core functionality
- Create database structure (if needed)
- Integrate CMS (if applicable)

## Testing Phase
- Conduct cross-browser testing
- Test responsive design on multiple devices
- Perform user testing
- Check for broken links
- Test all forms and interactive elements`;
  } else {
    // Generic task list for any other topic
    return `# ${topic} Task List

## Planning Phase
- Define goals and objectives for ${topic} (high priority)
- Research best practices for ${topic}
- Create a timeline with milestones (due: next week)
- Identify necessary resources and budget
- Assign responsibilities (if working with others)

## Implementation Phase
- Start with high-priority tasks first (high priority)
- Schedule regular check-ins to monitor progress
- Document processes and decisions
- Adjust timeline as needed
- Communicate updates to stakeholders

## Review Phase
- Evaluate results against initial goals
- Gather feedback from participants/users
- Document lessons learned
- Identify areas for improvement
- Celebrate successes and achievements`;
  }
}

function generateGenericList(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('meal') || lowerInput.includes('recipe') || lowerInput.includes('food')) {
    return generateMealPlan();
  } else if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('fitness')) {
    return generateWorkoutPlan();
  } else if (lowerInput.includes('travel') || lowerInput.includes('vacation') || lowerInput.includes('trip')) {
    return generateTravelChecklist();
  } else if (lowerInput.includes('book') || lowerInput.includes('read')) {
    return generateReadingList();
  } else {
    return `# ${extractTopic(userInput)} List

## Essential Items
- Item 1 (high priority)
- Item 2
- Item 3
- Item 4 (due: next week)

## Secondary Items
- Item 5
- Item 6
- Item 7

## Optional Items
- Item 8
- Item 9
- Item 10`;
  }
}

function generateMealPlan(): string {
  return `# Weekly Meal Plan

## Monday
- **Breakfast**: Overnight oats with berries and nuts
- **Lunch**: Quinoa salad with roasted vegetables
- **Dinner**: Baked salmon with asparagus and sweet potato

## Tuesday
- **Breakfast**: Avocado toast with poached eggs
- **Lunch**: Lentil soup with whole grain bread
- **Dinner**: Grilled chicken with roasted Brussels sprouts

## Wednesday
- **Breakfast**: Green smoothie (spinach, banana, protein powder)
- **Lunch**: Mediterranean wrap with hummus and vegetables
- **Dinner**: Turkey meatballs with zucchini noodles

## Thursday
- **Breakfast**: Vegetable omelet with whole grain toast
- **Lunch**: Chicken and vegetable stir-fry with brown rice
- **Dinner**: Baked cod with quinoa and steamed broccoli

## Friday
- **Breakfast**: Greek yogurt parfait with granola and berries
- **Lunch**: Tuna salad lettuce wraps
- **Dinner**: Black bean and sweet potato tacos with avocado`;
}

function generateWorkoutPlan(): string {
  return `# 4-Week Beginner Workout Plan

## Week 1: Foundation
### Monday - Full Body
- Bodyweight squats: 3 sets of 10 reps
- Push-ups (modified if needed): 3 sets of 8 reps
- Walking lunges: 2 sets of 10 reps per leg
- Plank: 3 sets, hold for 20 seconds

### Tuesday - Cardio
- Brisk walking: 30 minutes
- Stretching: 10 minutes

### Wednesday - Rest Day
- Light stretching or yoga

### Thursday - Full Body
- Glute bridges: 3 sets of 12 reps
- Dumbbell rows (or water bottle): 3 sets of 10 reps
- Wall sits: 3 sets, hold for 20 seconds
- Bicycle crunches: 3 sets of 10 reps

## Week 2: Building Endurance
### Monday - Full Body
- Bodyweight squats: 3 sets of 12 reps
- Push-ups: 3 sets of 10 reps
- Walking lunges: 3 sets of 10 reps per leg
- Plank: 3 sets, hold for 30 seconds

### Tuesday - Cardio
- Brisk walking/light jogging: 35 minutes
- Stretching: 10 minutes`;
}

function generateTravelChecklist(): string {
  return `# Travel Packing Checklist

## Essential Documents
- Passport/ID (high priority)
- Flight tickets/boarding passes
- Hotel reservations
- Travel insurance documents
- Driver's license
- Credit/debit cards
- Cash in local currency

## Clothing
- Underwear (1 pair per day plus extras)
- Socks (1 pair per day plus extras)
- T-shirts/tops
- Pants/shorts/skirts
- Sweater/jacket/coat (weather appropriate)
- Sleepwear
- Comfortable walking shoes

## Toiletries
- Toothbrush and toothpaste
- Shampoo and conditioner
- Body wash/soap
- Deodorant
- Moisturizer
- Sunscreen (high priority if sunny destination)
- Prescription medications (in original containers)

## Electronics
- Smartphone and charger (high priority)
- Camera and charger
- Laptop/tablet and charger (if needed)
- Power bank
- Travel adapter/converter`;
}

function generateReadingList(): string {
  return `# Personal Development Reading List

## Self-Improvement
- "Atomic Habits" by James Clear (high priority)
- "Mindset: The New Psychology of Success" by Carol Dweck
- "Deep Work" by Cal Newport
- "The 7 Habits of Highly Effective People" by Stephen Covey
- "Thinking, Fast and Slow" by Daniel Kahneman

## Career Development
- "Range: Why Generalists Triumph in a Specialized World" by David Epstein
- "Never Split the Difference" by Chris Voss
- "Radical Candor" by Kim Scott
- "Designing Your Life" by Bill Burnett and Dave Evans
- "So Good They Can't Ignore You" by Cal Newport

## Financial Literacy
- "The Psychology of Money" by Morgan Housel (high priority)
- "I Will Teach You to Be Rich" by Ramit Sethi
- "Your Money or Your Life" by Vicki Robin
- "The Simple Path to Wealth" by J.L. Collins`;
}

function generateProductivityAnalysisResponse(userInput: string): string {
  // Extract metrics if available
  const completionRateMatch = userInput.match(/Task completion rate: (\d+)%/);
  const habitCompletionMatch = userInput.match(/Habit completion rate today: (\d+)%/);
  
  const taskCompletionRate = completionRateMatch ? parseInt(completionRateMatch[1]) : null;
  const habitCompletionRate = habitCompletionMatch ? parseInt(habitCompletionMatch[1]) : null;
  
  if (taskCompletionRate !== null && habitCompletionRate !== null) {
    if (taskCompletionRate > 70 && habitCompletionRate > 70) {
      return "Excellent progress! You're demonstrating strong consistency in both task completion and habit maintenance. This balanced approach is ideal for sustainable productivity. Consider increasing task complexity or adding more challenging habits to continue growing.";
    } else if (taskCompletionRate > 70 && habitCompletionRate <= 70) {
      return "Good work on task completion! Your focus on getting things done is paying off. To improve overall well-being, try allocating more attention to your habit consistency, which will support your productivity in the long term.";
    } else if (taskCompletionRate <= 70 && habitCompletionRate > 70) {
      return "Your habit consistency is impressive! To complement this foundation, try breaking down your tasks into smaller, more manageable pieces to improve your task completion rate and overall productivity.";
    } else {
      return "You're making progress, but there's room for improvement. Focus on completing your highest-priority tasks first and choose 1-2 key habits to build consistency. Remember that small, consistent steps lead to significant results over time.";
    }
  } else {
    return "You're making good progress! Focus on completing your most important tasks first and maintain consistency with your habits. Remember to take regular breaks to prevent burnout and sustain your productivity momentum.";
  }
}

// Helper functions
function extractTopic(userInput: string): string {
  // Look for phrases like "for X" or "about X"
  const forMatch = userInput.match(/for\s+([^.,?!]+)/i);
  const aboutMatch = userInput.match(/about\s+([^.,?!]+)/i);
  const onMatch = userInput.match(/on\s+([^.,?!]+)/i);
  
  if (forMatch) {
    return forMatch[1].trim();
  } else if (aboutMatch) {
    return aboutMatch[1].trim();
  } else if (onMatch) {
    return onMatch[1].trim();
  } else {
    // Extract words after common list request phrases
    const phrases = ['create a', 'make a', 'generate a', 'give me a', 'i need a'];
    for (const phrase of phrases) {
      if (userInput.toLowerCase().includes(phrase)) {
        const afterPhrase = userInput.toLowerCase().split(phrase)[1].trim();
        const words = afterPhrase.split(' ');
        // Skip words like "list", "checklist", etc.
        const skipWords = ['list', 'checklist', 'to-do', 'todo', 'plan', 'for', 'of'];
        let startIndex = 0;
        while (startIndex < words.length && skipWords.includes(words[startIndex])) {
          startIndex++;
        }
        if (startIndex < words.length) {
          return words.slice(startIndex).join(' ').replace(/[.,?!].*$/, '');
        }
      }
    }
    
    // Default to a generic topic if we can't extract one
    return "Project";
  }
}

// Public API functions
export async function generateTaskSuggestions(userContext: string): Promise<string[]> {
  try {
    const suggestions = [
      "Complete the weekly progress report with detailed metrics",
      "Schedule a focused brainstorming session for the upcoming project",
      "Review and prioritize backlog items for the next sprint",
      "Update documentation with recent changes and improvements",
      "Prepare agenda for the team sync meeting"
    ];
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return suggestions.slice(0, 3);
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return ['Review your current tasks', 'Plan tomorrow\'s priorities', 'Take a short break'];
  }
}

export async function analyzeProductivity(tasks: any[], habits: any[]): Promise<string> {
  try {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const today = new Date().toISOString().split('T')[0];
    const habitsCompletedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const habitCompletionRate = habits.length > 0 ? Math.round((habitsCompletedToday / habits.length) * 100) : 0;
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return generateProductivityAnalysisResponse(`Task completion rate: ${completionRate}% Habit completion rate today: ${habitCompletionRate}%`);
  } catch (error) {
    console.error('Error analyzing productivity:', error);
    return 'Your task completion rate is showing good progress. Focus on maintaining consistency and completing your highest priority tasks first.';
  }
}

export async function generateFocusTip(): Promise<string> {
  try {
    const focusTips = [
      "Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break. This helps maintain concentration and prevents burnout.",
      "Implement the 'Two-Minute Rule': If a task takes less than two minutes, do it immediately rather than scheduling it for later.",
      "Use the 'Eisenhower Box' to categorize tasks by urgency and importance, focusing first on what's both urgent and important.",
      "Practice 'Deep Work' by scheduling blocks of time (1-4 hours) for focused, distraction-free work on your most important projects.",
      "Try 'Timeboxing' by allocating specific time blocks for tasks in your calendar, treating these appointments with yourself as non-negotiable.",
      "Minimize context switching by grouping similar tasks together, which can improve efficiency by up to 80%."
    ];
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return focusTips[Math.floor(Math.random() * focusTips.length)];
  } catch (error) {
    console.error('Error generating focus tip:', error);
    return 'Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break. This method works with your brain\'s natural attention cycles and has been shown to improve productivity by up to 25% in research studies.';
  }
}

export async function suggestHabitImprovements(habits: any[]): Promise<string[]> {
  try {
    const suggestions = [
      "Drink water every hour to stay hydrated and maintain energy levels",
      "Take a 5-minute walk after each hour of focused work to improve circulation",
      "Practice mindfulness for 10 minutes daily to reduce stress and improve focus",
      "Set aside 20 minutes for planning at the start of each day",
      "Review your accomplishments at the end of each day"
    ];
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return suggestions.slice(0, 3);
  } catch (error) {
    console.error('Error suggesting habit improvements:', error);
    return ['Drink more water throughout the day', 'Take short walks after periods of sitting', 'Practice mindfulness for 5 minutes daily'];
  }
}