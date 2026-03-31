import React from 'react';
import theme from '../../theme/theme';

const DarkCard = ({ children, className = '', hover = true, ...props }) => {
  const baseClasses = `
    bg-[#1A1C22] 
    border border-[#2A2D36] 
    rounded-xl 
    ${theme.shadows.card}
    ${hover ? 'hover:' + theme.shadows.cardHover : ''}
    transition-all duration-300
    ${className}
  `;

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default DarkCard;
