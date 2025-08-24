import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  setCurrentPage: (page: string) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setCurrentPage }) => {
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
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p>
            Welcome to Taskly ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Create an account</li>
            <li>Use our application features</li>
            <li>Contact our support team</li>
            <li>Respond to surveys or communications</li>
          </ul>
          <p>
            This information may include:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Email address</li>
            <li>Password (encrypted)</li>
            <li>Task and habit data</li>
            <li>Usage statistics</li>
            <li>Device information</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Data Retention</h2>
          <p>
            We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information, please contact us at nafiadg@gmail.com.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your information</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> nafiadg@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;