import React from 'react';
import { Github, Twitter, Mail, Linkedin, Instagram } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className="bg-white shadow-sm py-4 px-6 dark:bg-gray-800 dark:border-t dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Taskly by <span className="font-cursive italic">Nafiyad</span>. All rights reserved.
          </p>
        </div>
        
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="mailto:nafiadg@gmail.com" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
            Support
          </a>
          <button 
            onClick={() => window.location.hash = 'privacy'}
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => window.location.hash = 'terms'}
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Terms of Service
          </button>
        </div>
        
        <div className="flex space-x-4">
          <a href="https://github.com/nafiyad" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://www.linkedin.com/in/nafiyad-adane-g-041a04200/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href="https://www.instagram.com/nafi_ad24/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="mailto:nafiadg@gmail.com" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;