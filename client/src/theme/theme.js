export const theme = {
  colors: {
    // Background Colors
    primaryBg: '#0B0B0F',
    secondaryBg: '#111217',
    cardBg: '#1A1C22',
    
    // Gradient Colors
    gradientStart: '#FF7A00',
    gradientEnd: '#FFB800',
    
    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A3BD',
    
    // Border Colors
    border: '#2A2D36',
    
    // Status Colors
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    
    // Semantic Colors
    pending: '#F59E0B',
    approved: '#22C55E',
    rejected: '#EF4444',
  },
  
  gradients: {
    primary: 'linear-gradient(90deg, #FF7A00, #FFB800)',
    success: 'linear-gradient(90deg, #22C55E, #16A34A)',
    danger: 'linear-gradient(90deg, #EF4444, #DC2626)',
    info: 'linear-gradient(90deg, #3B82F6, #2563EB)',
  },
  
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    navbar: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

export default theme;
