import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIAssistant from './AIAssistant';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  DollarSign,
  Search,
  Bell,
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Group Management',
      href: '/groups',
      icon: Users,
      current: location.pathname.startsWith('/groups'),
    },
    {
      name: 'Resource Management',
      href: '/resources',
      icon: BookOpen,
      current: location.pathname.startsWith('/resources'),
    },
    {
      name: 'Skill Matching',
      href: '/skills',
      icon: GraduationCap,
      current: location.pathname.startsWith('/skills'),
    },
    {
      name: 'Academic Progress',
      href: '/progress',
      icon: TrendingUp,
      current: location.pathname.startsWith('/progress'),
    },
    {
      name: 'Kuppi Ads',
      href: '/kuppi',
      icon: DollarSign,
      current: location.pathname.startsWith('/kuppi'),
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#111217] shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#2A2D36]">
          <h1 className="text-xl font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FFB800] bg-clip-text text-transparent">Uni-Connect</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-[#A0A3BD] hover:text-white hover:bg-[#1A1C22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                    ${item.current
                      ? 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800] text-white shadow-lg'
                      : 'text-[#A0A3BD] hover:bg-[#1A1C22] hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2D36]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB800] flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[#A0A3BD] capitalize">{user?.role}</p>
            </div>
            <div className="flex space-x-1">
              <button
                className="p-1 rounded-full text-[#A0A3BD] hover:text-white hover:bg-[#1A1C22]"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-1 rounded-full text-[#A0A3BD] hover:text-[#EF4444] hover:bg-[#1A1C22]"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-[#111217] shadow-lg border-b border-[#2A2D36]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-[#A0A3BD] hover:text-white hover:bg-[#1A1C22]"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search bar */}
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1C22] border border-[#2A2D36] rounded-lg text-white placeholder-[#A0A3BD] focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#A0A3BD]" />
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-[#A0A3BD] hover:text-white hover:bg-[#1A1C22]">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-[#0B0B0F]">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};

export default Layout;
