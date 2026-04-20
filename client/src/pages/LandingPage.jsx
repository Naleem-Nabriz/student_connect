import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import GradientButton from '../components/ui/GradientButton';
import { Users, Target, TrendingUp, BookOpen, ChevronLeft, ChevronRight, GraduationCap, Sparkles, LibraryBig, BarChart3 } from 'lucide-react';

const heroSlides = [
  {
    id: 'progress',
    badge: 'Academic analytics',
    title: 'Track grades with a clearer academic view',
    description: 'See subject performance, attendance trends, and weekly momentum in a dashboard built for students.',
    accent: 'from-[#0f6c7a] via-[#1f8ea3] to-[#f2c94c]',
    panel: 'from-[#f7fcff] to-[#eef6f7]',
    icon: BarChart3,
    stats: [
      { label: 'Subjects', value: '06' },
      { label: 'Attendance', value: '92%' },
      { label: 'Progress', value: 'A-' },
    ],
  },
  {
    id: 'collab',
    badge: 'Study together',
    title: 'Build stronger study groups and skill matches',
    description: 'Connect with peers, organize group work, and discover students who complement your strengths.',
    accent: 'from-[#e07a5f] via-[#f0a36f] to-[#f2c94c]',
    panel: 'from-[#fff7f3] to-[#fff1dd]',
    icon: Users,
    stats: [
      { label: 'Partners', value: '18' },
      { label: 'Groups', value: '04' },
      { label: 'Matches', value: '96%' },
    ],
  },
  {
    id: 'resources',
    badge: 'Campus resources',
    title: 'Discover learning resources in one flowing workspace',
    description: 'Collect notes, opportunities, and class ads in a single interface that feels organized and modern.',
    accent: 'from-[#304b76] via-[#5b79ad] to-[#9bc3d8]',
    panel: 'from-[#f5f8ff] to-[#eef2fb]',
    icon: LibraryBig,
    stats: [
      { label: 'Resources', value: '45' },
      { label: 'Classes', value: '12' },
      { label: 'Saved', value: '28' },
    ],
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  const goToPreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,119,182,0.10),transparent_24%),radial-gradient(circle_at_top_right,rgba(224,122,95,0.12),transparent_24%),linear-gradient(180deg,#FDF6EC_0%,#fffaf2_100%)] text-[#3D3D3D]">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-[#3D3D3D] md:text-6xl">
                Academic Progress & <br />
                <span className="bg-gradient-to-r from-[#0077B6] to-[#E07A5F] bg-clip-text text-transparent">
                  Student Collaboration
                </span> System
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-[#62574d]">
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
                  className="rounded-full border-2 border-[#0077B6] px-8 py-4 text-lg text-[#0077B6] transition-all duration-300 hover:bg-[#0077B6] hover:text-white"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-[560px]">
                <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-[#0f6c7a]/12 blur-3xl" />
                <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/65 p-4 shadow-[0_28px_80px_rgba(61,61,61,0.12)] backdrop-blur-sm">
                  <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                  >
                    {heroSlides.map((slide) => {
                      const SlideIcon = slide.icon;

                      return (
                        <div key={slide.id} className="w-full flex-shrink-0">
                          <div className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br ${slide.accent} p-6 text-white`}>
                            <div className="absolute -right-8 top-6 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
                            <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-black/10 blur-3xl" />
                            <div className="relative z-10 space-y-5">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
                                  {slide.badge}
                                </span>
                                <div className="rounded-2xl bg-white/15 p-3">
                                  <SlideIcon className="h-6 w-6" />
                                </div>
                              </div>

                              <div>
                                <h3 className="max-w-sm text-2xl font-semibold leading-tight">
                                  {slide.title}
                                </h3>
                                <p className="mt-3 max-w-md text-sm leading-6 text-white/88">
                                  {slide.description}
                                </p>
                              </div>

                              <div className={`rounded-[24px] bg-gradient-to-br ${slide.panel} p-4 text-[#3D3D3D] shadow-[0_18px_40px_rgba(18,36,52,0.12)]`}>
                                <div className="mb-4 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#85786c]">
                                      Uni-Connect
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-[#24404c]">
                                      Student snapshot
                                    </p>
                                  </div>
                                  <Sparkles className="h-5 w-5 text-[#0f6c7a]" />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  {slide.stats.map((stat) => (
                                    <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-3 text-center">
                                      <p className="text-lg font-bold text-[#0f6c7a]">{stat.value}</p>
                                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#85786c]">
                                        {stat.label}
                                      </p>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3">
                                  {slide.id === 'progress' && <GraduationCap className="h-5 w-5 text-[#0f6c7a]" />}
                                  {slide.id === 'collab' && <Users className="h-5 w-5 text-[#0f6c7a]" />}
                                  {slide.id === 'resources' && <BookOpen className="h-5 w-5 text-[#0f6c7a]" />}
                                  <div>
                                    <p className="text-sm font-semibold text-[#24404c]">Smarter student workflow</p>
                                    <p className="text-xs text-[#6b6258]">Professional tools for planning, matching, and tracking.</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {heroSlides.map((slide, index) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => setActiveSlide(index)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            index === activeSlide ? 'w-8 bg-[#0f6c7a]' : 'w-2.5 bg-[#d5c8b9] hover:bg-[#b7a898]'
                          }`}
                          aria-label={`Show slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={goToPreviousSlide}
                        className="rounded-full border border-[#eadfce] bg-white p-2.5 text-[#5f5952] shadow-sm transition-all duration-300 hover:border-[#0f6c7a]/35 hover:text-[#0f6c7a]"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNextSlide}
                        className="rounded-full border border-[#eadfce] bg-white p-2.5 text-[#5f5952] shadow-sm transition-all duration-300 hover:border-[#0f6c7a]/35 hover:text-[#0f6c7a]"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#fffaf2] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-[#3D3D3D] md:text-4xl">
              Powerful Features for Students
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-[#62574d]">
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
            <h2 className="mb-6 text-3xl font-bold text-[#3D3D3D] md:text-4xl">
              About Uni-Connect
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-[#62574d]">
              Uni-Connect is a comprehensive platform designed specifically for university students.
              We understand the challenges of modern education and provide tools that help you
              stay organized, connected, and motivated throughout your academic journey.
            </p>
            <p className="text-lg leading-relaxed text-[#62574d]">
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
