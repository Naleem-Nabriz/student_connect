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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#eadfce] bg-[#fffaf2]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="bg-gradient-to-r from-[#0077B6] to-[#E07A5F] bg-clip-text text-2xl font-bold text-transparent">
              Uni-Connect
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#62574d] transition-colors duration-300 hover:text-[#0077B6]"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-[#62574d] transition-colors duration-300 hover:text-[#0077B6]"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#62574d] transition-colors duration-300 hover:text-[#0077B6]"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#62574d] transition-colors duration-300 hover:text-[#0077B6]"
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
