import React, { useState } from 'react';
import { ArrowLeft, Check, X, Zap, Award, Star, Clock, Calendar, Download, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionPlan } from '../types';
import toast from 'react-hot-toast';

interface SubscriptionProps {
  setCurrentPage: (page: string) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setCurrentPage }) => {
  const { subscription, updateSubscription } = useAuth();
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Up to 20 tasks',
        'Up to 5 habits',
        'Basic focus timer',
        'Limited achievements',
        'Standard support'
      ]
    },
    {
      id: 'pro-monthly',
      name: 'Pro',
      price: 9.99,
      interval: 'month',
      features: [
        'Unlimited tasks',
        'Unlimited habits',
        'Advanced focus timer',
        'All achievements & challenges',
        'AI productivity insights',
        'Custom themes',
        'Data export',
        'Priority support'
      ],
      isPopular: true
    },
    {
      id: 'pro-yearly',
      name: 'Pro',
      price: 99.99,
      interval: 'year',
      features: [
        'Unlimited tasks',
        'Unlimited habits',
        'Advanced focus timer',
        'All achievements & challenges',
        'AI productivity insights',
        'Custom themes',
        'Data export',
        'Priority support',
        '2 months free'
      ],
      isPopular: true
    }
  ];

  const filteredPlans = plans.filter(plan => 
    plan.id === 'free' || plan.interval === selectedInterval
  );

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    try {
      // For demo purposes, we'll just update the subscription status
      if (planId === 'free') {
        await updateSubscription('free');
      } else if (planId === 'pro-monthly' || planId === 'pro-yearly') {
        await updateSubscription('pro');
      }
      
      toast.success(`Successfully subscribed to ${planId.includes('pro') ? 'Pro' : 'Free'} plan!`);
      
      // In a real app, you would redirect to a checkout page or open a payment modal
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to update subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('task')) return <Calendar className="h-4 w-4 text-blue-500" />;
    if (feature.includes('habit')) return <Calendar className="h-4 w-4 text-green-500" />;
    if (feature.includes('focus')) return <Clock className="h-4 w-4 text-purple-500" />;
    if (feature.includes('achievement') || feature.includes('challenge')) return <Award className="h-4 w-4 text-yellow-500" />;
    if (feature.includes('AI')) return <Zap className="h-4 w-4 text-orange-500" />;
    if (feature.includes('theme')) return <Star className="h-4 w-4 text-pink-500" />;
    if (feature.includes('export')) return <Download className="h-4 w-4 text-indigo-500" />;
    if (feature.includes('support')) return <MessageCircle className="h-4 w-4 text-teal-500" />;
    return <Check className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Subscription Plans</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Choose Your Plan</h2>
              <p className="text-gray-600 dark:text-gray-300">Select the plan that best fits your needs</p>
            </div>
            
            <div className="bg-gray-100 p-1 rounded-lg dark:bg-gray-700">
              <div className="flex">
                <button
                  onClick={() => setSelectedInterval('month')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectedInterval === 'month'
                      ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-600 dark:text-white'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedInterval('year')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectedInterval === 'year'
                      ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-600 dark:text-white'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`border rounded-lg p-6 ${
                  plan.isPopular 
                    ? 'border-blue-500 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-700'
                } relative`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-bl-lg rounded-tr-lg dark:bg-blue-600">
                    Popular
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-gray-800 mb-2 dark:text-white">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-800 dark:text-white">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                      /{plan.interval}
                    </span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-0.5">
                        {getFeatureIcon(feature)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || (subscription.plan === 'pro' && plan.id.includes('pro')) || (subscription.plan === 'free' && plan.id === 'free')}
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? 'Processing...' : 
                   (subscription.plan === 'pro' && plan.id.includes('pro')) || 
                   (subscription.plan === 'free' && plan.id === 'free') 
                    ? 'Current Plan' 
                    : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 dark:text-white">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">What's included in the free plan?</h3>
            <p className="text-gray-600 mt-1 dark:text-gray-300">
              The free plan includes basic task management, habit tracking, and focus timer features with some limitations on the number of items you can create.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">Can I cancel my subscription anytime?</h3>
            <p className="text-gray-600 mt-1 dark:text-gray-300">
              Yes, you can cancel your subscription at any time. Your Pro features will remain active until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">Is there a difference between monthly and yearly billing?</h3>
            <p className="text-gray-600 mt-1 dark:text-gray-300">
              Yes, with yearly billing you get a discount equivalent to 2 months free compared to the monthly plan.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">What payment methods do you accept?</h3>
            <p className="text-gray-600 mt-1 dark:text-gray-300">
              We accept all major credit cards, PayPal, and Apple Pay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;