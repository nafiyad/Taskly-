import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Mail, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface AccountSettingsProps {
  setCurrentPage: (page: string) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ setCurrentPage }) => {
  const { user, signOut } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || email === user?.email) {
      return;
    }
    
    setIsChangingEmail(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        email: email
      });
      
      if (error) throw error;
      
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update email');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );
    
    if (confirmed) {
      try {
        // In a real application, you would implement a secure account deletion process
        // This is a simplified example
        toast.error('Account deletion is disabled in this demo');
        
        // Example of how it might be implemented:
        // const { error } = await supabase.rpc('delete_user_account');
        // if (error) throw error;
        // await signOut();
        // toast.success('Your account has been deleted');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete account');
      }
    }
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-gray-800 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 dark:bg-blue-900 dark:text-blue-300">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Information</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage your account details and preferences</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
              <Mail className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              Email Address
            </h3>
            <form onSubmit={handleEmailChange} className="ml-7">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Current Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Changing your email will require verification of the new address
                </p>
              </div>
              
              <button 
                type="submit"
                disabled={isChangingEmail || email === user?.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isChangingEmail ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Email'
                )}
              </button>
            </form>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
              <Lock className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="ml-7">
              <div className="mb-4">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isChangingPassword ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center dark:text-white">
              <Shield className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
              Account Security
            </h3>
            <div className="ml-7">
              <button 
                onClick={signOut}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out of All Devices
              </button>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-medium text-red-600 mb-2 dark:text-red-400">Danger Zone</h4>
                <p className="text-sm text-gray-600 mb-4 dark:text-gray-400">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;