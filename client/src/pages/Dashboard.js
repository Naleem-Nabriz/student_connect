import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, GraduationCap, Plus, Star, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
      title: 'Academic Progress',
      value: stats.subjects,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/academic',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#eadfce] border-t-[#0077B6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-[28px] bg-[linear-gradient(135deg,#0077B6,#E07A5F)] p-8 text-white shadow-[0_22px_60px_rgba(0,119,182,0.20)]">
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
              className="cursor-pointer rounded-[24px] border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(253,246,236,0.92))] p-6 shadow-[0_16px_35px_rgba(61,61,61,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0077B6]/25 hover:shadow-[0_22px_45px_rgba(61,61,61,0.12)]"
              onClick={() => navigate(stat.link)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#62574d]">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold text-[#3D3D3D]">{stat.value}</p>
                </div>
                <div className="rounded-full bg-[linear-gradient(135deg,#0077B6,#E07A5F)] p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="rounded-[24px] border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(253,246,236,0.92))] p-6 shadow-[0_16px_35px_rgba(61,61,61,0.08)]">
          <h2 className="mb-4 text-lg font-semibold text-[#3D3D3D]">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/groups')}
              className="w-full rounded-full bg-[#0077B6] px-4 py-3 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Study Group
            </button>
            <button
              onClick={() => (window.location.href = '/resources')}
              className="w-full rounded-full bg-[#E07A5F] px-4 py-3 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Resource
            </button>
            <button
              onClick={() => (window.location.href = '/skills')}
              className="w-full rounded-full bg-[#F2C94C] px-4 py-3 text-[#5b4709] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Find Study Partners
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-[24px] border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(253,246,236,0.92))] p-6 shadow-[0_16px_35px_rgba(61,61,61,0.08)]">
          <h2 className="mb-4 text-lg font-semibold text-[#3D3D3D]">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rounded-2xl bg-[#fffaf2] p-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0077B6,#E07A5F)]">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#3D3D3D]">New study group created</p>
                <p className="text-xs text-[#85786c]">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-2xl bg-[#fffaf2] p-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E07A5F,#F2C94C)]">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#3D3D3D]">Resource uploaded</p>
                <p className="text-xs text-[#85786c]">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-2xl bg-[#fffaf2] p-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0077B6,#4f9fc6)]">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#3D3D3D]">New skill request</p>
                <p className="text-xs text-[#85786c]">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="rounded-[24px] border border-[#eadfce] bg-[linear-gradient(135deg,rgba(242,201,76,0.28),rgba(224,122,95,0.18))] p-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-[#3D3D3D]">Pro Tips</h3>
            <ul className="space-y-1 text-sm text-[#62574d]">
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
