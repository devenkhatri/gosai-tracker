import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Calendar, IndianRupee, Menu, X, LogOut, Home, 
  ChevronDown, User, Settings 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
          isActive 
            ? 'bg-blue-50 text-blue-700 font-medium' 
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
      onClick={() => setMobileMenuOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 md:hidden"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center">
                <IndianRupee className="h-7 w-7 text-blue-600 mr-2" />
                <span className="font-semibold text-xl text-gray-900">Financial Tracker</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="hidden md:flex space-x-2">
                <NavItem to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Dashboard
                </NavItem>
                <NavItem to="/month">
                  <Calendar className="h-5 w-5 mr-2" />
                  Month
                </NavItem>
                <NavItem to="/week">
                  <Calendar className="h-5 w-5 mr-2" />
                  Week
                </NavItem>
                <NavItem to="/day">
                  <Calendar className="h-5 w-5 mr-2" />
                  Day
                </NavItem>
              </div>
              
              <div className="ml-4 relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {user?.picture ? (
                      <img src={user.picture} alt="Profile" className="h-8 w-8" />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fade-in">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md z-20 border-b animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavItem to="/">
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </NavItem>
            <NavItem to="/month">
              <Calendar className="h-5 w-5 mr-2" />
              Month
            </NavItem>
            <NavItem to="/week">
              <Calendar className="h-5 w-5 mr-2" />
              Week
            </NavItem>
            <NavItem to="/day">
              <Calendar className="h-5 w-5 mr-2" />
              Day
            </NavItem>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;