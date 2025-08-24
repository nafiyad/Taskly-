import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  setCurrentPage: (page: string) => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <button 
          onClick={() => setCurrentPage('dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
        
        <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Taskly ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h2>
          <p>
            Taskly is a productivity application that helps users manage tasks, track habits, and improve focus. We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
          <p>
            To use certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          <p className="mt-2">
            You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Provide accurate and complete information when creating your account</li>
            <li>Update your information to keep it current</li>
            <li>Safeguard your account credentials</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. User Content</h2>
          <p>
            You retain all rights to any content you submit, post, or display on or through the Service. By submitting content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Prohibited Activities</h2>
          <p>
            You agree not to engage in any of the following activities:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Violating any applicable laws or regulations</li>
            <li>Impersonating another person or entity</li>
            <li>Interfering with or disrupting the Service</li>
            <li>Attempting to gain unauthorized access to the Service</li>
            <li>Using the Service for any illegal or unauthorized purpose</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Taskly and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
          <p>
            In no event shall Taskly, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> nafiadg@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;