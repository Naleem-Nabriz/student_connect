import React from 'react';
import theme from '../../theme/theme';

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
        return 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800]';
      case 'success':
        return 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]';
      case 'danger':
        return 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]';
      case 'info':
        return 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]';
      default:
        return 'bg-gradient-to-r from-[#FF7A00] to-[#FFB800]';
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
    text-white 
    font-medium 
    rounded-lg
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
