import React from 'react';
import theme from '../../theme/theme';

const PageLayout = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`min-h-screen bg-[#0B0B0F] ${className}`} {...props}>
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[#0B0B0F] bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#A0A3BD] text-lg">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
