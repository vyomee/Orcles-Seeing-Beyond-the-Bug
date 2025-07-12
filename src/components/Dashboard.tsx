import React from 'react';
import { LogOut, User } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface DashboardProps {
  user: UserType;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <button
              onClick={onSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {user.profile_picture_path ? (
                <img
                  src={user.profile_picture_path}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.username}!</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Profile Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Username:</span> {user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Country:</span> {user.country}</p>
                <p><span className="font-medium">State:</span> {user.state}</p>
                <p><span className="font-medium">Member since:</span> {new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  Edit Profile
                </button>
                <button className="w-full text-left px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                  View Settings
                </button>
                <button className="w-full text-left px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;