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
    <div className={`min-h-screen bg-[#FDF6EC] ${className}`} {...props}>
      {/* Background Pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,119,182,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(224,122,95,0.10),transparent_26%)] opacity-90" />
      
      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-[#3D3D3D]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-lg text-[#62574d]">
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
