import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GradientButton from './ui/GradientButton';

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0F]/95 backdrop-blur-sm border-b border-[#2A2D36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#FF7A00] to-[#FFB800] bg-clip-text text-transparent">
              Uni-Connect
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#A0A3BD] hover:text-white transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#A0A3BD] hover:text-white transition-colors duration-300"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#A0A3BD] hover:text-white transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#A0A3BD] hover:text-white transition-colors duration-300"
            >
              Contact
            </button>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
            <GradientButton onClick={() => navigate('/login')}>
              Login
            </GradientButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;