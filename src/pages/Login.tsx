import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronRight, IndianRupee, Calendar } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <IndianRupee className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Financial Tracker</h1>
          <p className="text-center text-gray-600 mb-8">
            Track your orders and payments with ease
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Multiple Views</h3>
                  <p className="text-sm text-gray-600">Day, week, and month views for better insights</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <IndianRupee className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Track Finances</h3>
                  <p className="text-sm text-gray-600">Monitor orders and payments with color coding</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={login}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300"
            >
              <span>Sign in to Demo</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-8">
          <p className="text-center text-white text-sm">
            Demo version - No authentication required
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;