import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, GraduationCap, Plus, Star, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Mock statistics data
  const stats = {
    groups: 12,
    resources: 45,
    skills: 8,
    collaborations: 3,
    subjects: 6,
  };

  const statCards = [
    {
      title: 'Study Groups',
      value: stats.groups,
      icon: Users,
      color: 'bg-blue-500',
      link: '/groups',
    },
    {
      title: 'Resources',
      value: stats.resources,
      icon: BookOpen,
      color: 'bg-green-500',
      link: '/resources',
    },
    {
      title: 'Skills',
      value: stats.skills,
      icon: GraduationCap,
      color: 'bg-purple-500',
      link: '/skills',
    },
    {
      title: 'Collaborations',
      value: stats.collaborations,
      icon: Users,
      color: 'bg-pink-500',
      link: '/collaborations',
    },
    {
      title: 'Subjects',
      value: stats.subjects,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/academic',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-solid border-gray-300 border-t-[#FF7A00] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FFB800] rounded-xl shadow-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-3">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-white/90 text-lg">
          Here's what's happening with your studies today.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-[#1A1C22] border border-[#2A2D36] rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:border-[#FF7A00] transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => (window.location.href = stat.link)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#A0A3BD]">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFB800]`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#1A1C22] border border-[#2A2D36] rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/groups')}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Study Group
            </button>
            <button
              onClick={() => (window.location.href = '/resources')}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Resource
            </button>
            <button
              onClick={() => (window.location.href = '/skills')}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Find Study Partners
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#1A1C22] border border-[#2A2D36] rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-[#111217] rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF7A00] to-[#FFB800] rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">New study group created</p>
                <p className="text-xs text-[#A0A3BD]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-[#111217] rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Resource uploaded</p>
                <p className="text-xs text-[#A0A3BD]">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-[#111217] rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">New skill request</p>
                <p className="text-xs text-[#A0A3BD]">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FFB800] rounded-xl p-6 border border-[#2A2D36]">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Pro Tips</h3>
            <ul className="text-sm text-white/90 space-y-1">
              <li>• Join study groups to collaborate with peers</li>
              <li>• Upload and share helpful resources</li>
              <li>• Use skill matching to find study partners</li>
              <li>• Track your academic progress regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
