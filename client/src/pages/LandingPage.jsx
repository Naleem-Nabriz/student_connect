import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import GradientButton from '../components/ui/GradientButton';
import { Users, Target, TrendingUp, BookOpen } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Academic Progress & <br />
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB800] bg-clip-text text-transparent">
                  Student Collaboration
                </span> System
              </h1>
              <p className="text-xl text-[#A0A3BD] mb-8 leading-relaxed">
                Track your academic journey, connect with peers, match skills,
                and discover learning opportunities all in one powerful platform
                designed for university students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <GradientButton
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 text-lg"
                >
                  Get Started
                </GradientButton>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 text-lg border-2 border-[#FF7A00] text-[#FF7A00] rounded-lg hover:bg-[#FF7A00] hover:text-white transition-all duration-300"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-center">
              <div className="relative">
                <svg
                  width="400"
                  height="400"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                >
                  {/* Background Circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="url(#gradientBg)"
                    opacity="0.1"
                  />

                  {/* Dashboard Icon */}
                  <rect
                    x="120"
                    y="140"
                    width="160"
                    height="120"
                    rx="8"
                    fill="#1A1C22"
                    stroke="#FF7A00"
                    strokeWidth="2"
                  />

                  {/* Chart Lines */}
                  <path
                    d="M140 180 L180 160 L220 190 L260 150"
                    stroke="#FF7A00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Students Icons */}
                  <circle cx="160" cy="250" r="20" fill="#FF7A00" />
                  <circle cx="200" cy="250" r="20" fill="#FFB800" />
                  <circle cx="240" cy="250" r="20" fill="#FF7A00" />

                  {/* Connection Lines */}
                  <path
                    d="M180 230 L200 230"
                    stroke="#A0A3BD"
                    strokeWidth="2"
                  />
                  <path
                    d="M220 230 L240 230"
                    stroke="#A0A3BD"
                    strokeWidth="2"
                  />

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="gradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF7A00" />
                      <stop offset="100%" stopColor="#FFB800" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#111217]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Students
            </h2>
            <p className="text-xl text-[#A0A3BD] max-w-2xl mx-auto">
              Everything you need to excel in your academic journey and build meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Users}
              title="Group Management"
              description="Create and manage study groups, collaborate on projects, and connect with like-minded students."
            />
            <FeatureCard
              icon={Target}
              title="Skill Matching"
              description="Find peers with complementary skills, form study partnerships, and enhance your learning experience."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Academic Progress Tracker"
              description="Monitor your grades, track assignments, and visualize your academic performance over time."
            />
            <FeatureCard
              icon={BookOpen}
              title="Kuppi Class Ads"
              description="Discover and advertise tutoring sessions, workshops, and educational opportunities."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              About Uni-Connect
            </h2>
            <p className="text-xl text-[#A0A3BD] leading-relaxed mb-8">
              Uni-Connect is a comprehensive platform designed specifically for university students.
              We understand the challenges of modern education and provide tools that help you
              stay organized, connected, and motivated throughout your academic journey.
            </p>
            <p className="text-lg text-[#A0A3BD] leading-relaxed">
              Whether you're looking to improve your grades, find study partners, or discover
              new learning opportunities, Uni-Connect empowers you to take control of your
              education and build lasting relationships with fellow students.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;