import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogOut, User, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import apiService from '../../services/apiService';

const Header = ({ title, description, action, sidebarCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiService.logout();
    navigate('/admin');
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300",
      sidebarCollapsed ? "ml-16" : "ml-64"
    )}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Action Button */}
            {action && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                {action}
              </Button>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Denis</span>
              </button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 