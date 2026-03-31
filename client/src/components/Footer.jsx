import React from 'react';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#111217] border-t border-[#2A2D36] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF7A00] to-[#FFB800] bg-clip-text text-transparent mb-4">
              Uni-Connect
            </h3>
            <p className="text-[#A0A3BD] leading-relaxed">
              Empowering university students with tools for academic progress tracking,
              skill matching, and collaborative learning.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <div className="flex items-center text-[#A0A3BD] mb-2">
              <Mail className="w-4 h-4 mr-2" />
              <span>contact@uni-connect.com</span>
            </div>
            <p className="text-[#A0A3BD]">
              © {currentYear} Uni-Connect. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#1A1C22] rounded-lg flex items-center justify-center hover:bg-[#FF7A00] transition-colors duration-300"
              >
                <Github className="w-5 h-5 text-[#A0A3BD] hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#1A1C22] rounded-lg flex items-center justify-center hover:bg-[#FF7A00] transition-colors duration-300"
              >
                <Twitter className="w-5 h-5 text-[#A0A3BD] hover:text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#1A1C22] rounded-lg flex items-center justify-center hover:bg-[#FF7A00] transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5 text-[#A0A3BD] hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;