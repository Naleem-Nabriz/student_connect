import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIAssistant from './AIAssistant';
import NotificationDropdown from './NotificationDropdown';
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
  CheckSquare,
  BarChart3,
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
      name: 'Task Management',
      href: '/tasks',
      icon: CheckSquare,
      current: location.pathname.startsWith('/tasks'),
    },
    {
      name: 'Progress Dashboard',
      href: '/progress',
      icon: BarChart3,
      current: location.pathname.startsWith('/progress'),
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
      href: '/academic',
      icon: TrendingUp,
      current: location.pathname.startsWith('/academic'),
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
    <div className="flex min-h-screen bg-[#FDF6EC]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-[#3D3D3D]/35 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-[#eadfce] bg-[#fffaf2] shadow-[0_24px_60px_rgba(61,61,61,0.10)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 items-center justify-between border-b border-[#eadfce] px-6">
          <h1 className="bg-gradient-to-r from-[#0077B6] to-[#E07A5F] bg-clip-text text-xl font-bold text-transparent">Uni-Connect</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="motion-button rounded-md p-2 text-[#85786c] hover:bg-white hover:text-[#3D3D3D] lg:hidden"
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
                    motion-nav group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                    ${item.current
                      ? 'bg-[linear-gradient(135deg,#0077B6,#E07A5F)] text-white shadow-[0_12px_24px_rgba(0,119,182,0.18)]'
                      : 'text-[#62574d] hover:bg-white hover:text-[#0077B6]'
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
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#eadfce] p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0077B6,#E07A5F)]">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-[#3D3D3D]">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs capitalize text-[#85786c]">{user?.role}</p>
            </div>
            <div className="flex space-x-1">
              <button
                className="motion-button rounded-full p-1 text-[#85786c] hover:bg-white hover:text-[#3D3D3D]"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="motion-button rounded-full p-1 text-[#85786c] hover:bg-white hover:text-[#E07A5F]"
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
        <header className="border-b border-[#eadfce] bg-[#fffaf2]/95 shadow-sm backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="motion-button rounded-md p-2 text-[#85786c] hover:bg-white hover:text-[#3D3D3D] lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search bar */}
              <div className="flex-1 max-w-lg mx-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-full border border-[#eadfce] bg-white pl-10 pr-4 py-2 text-[#3D3D3D] placeholder-[#85786c] focus:border-[#0077B6] focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#85786c]" />
                </div>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(0,119,182,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(224,122,95,0.10),transparent_24%),linear-gradient(180deg,#FDF6EC_0%,#fffaf2_100%)]">
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
