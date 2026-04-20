import React from 'react';

const GradientButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const getGradient = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#0077B6] to-[#E07A5F]';
      case 'success':
        return 'bg-gradient-to-r from-[#0077B6] to-[#4f9fc6]';
      case 'danger':
        return 'bg-gradient-to-r from-[#E07A5F] to-[#c96a52]';
      case 'info':
        return 'bg-gradient-to-r from-[#F2C94C] to-[#ddb73f]';
      default:
        return 'bg-gradient-to-r from-[#0077B6] to-[#E07A5F]';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const baseClasses = `
    ${getGradient()}
    ${getSize()}
    motion-button
    text-white 
    font-medium 
    rounded-full
    transition-all duration-300
    transform 
    hover:scale-105 
    hover:shadow-lg
    active:scale-95
    disabled:opacity-50 
    disabled:cursor-not-allowed 
    disabled:transform-none
    ${className}
  `;

  return (
    <button className={baseClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default GradientButton;
