import React from 'react';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: Linkedin },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-[#eadfce] bg-[#fffaf2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="mb-4 bg-gradient-to-r from-[#0077B6] to-[#E07A5F] bg-clip-text text-2xl font-bold text-transparent">
              Uni-Connect
            </h3>
            <p className="leading-relaxed text-[#62574d]">
              Empowering university students with tools for academic progress tracking,
              skill matching, and collaborative learning.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#3D3D3D]">Contact</h4>
            <div className="mb-2 flex items-center text-[#62574d]">
              <Mail className="w-4 h-4 mr-2" />
              <span>contact@uni-connect.com</span>
            </div>
            <p className="text-[#62574d]">&copy; {currentYear} Uni-Connect. All rights reserved.</p>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-[#3D3D3D]">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-colors duration-300 hover:bg-[#0077B6]"
                >
                  <Icon className="h-5 w-5 text-[#62574d] hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
