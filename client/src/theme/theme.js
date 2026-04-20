export const theme = {
  colors: {
    primaryBg: '#FDF6EC',
    secondaryBg: '#fffaf2',
    cardBg: '#fffdf8',
    gradientStart: '#0077B6',
    gradientEnd: '#E07A5F',
    accent: '#F2C94C',
    textPrimary: '#3D3D3D',
    textSecondary: '#62574d',
    border: '#eadfce',
    
    // Status Colors
    success: '#0077B6',
    warning: '#F2C94C',
    danger: '#E07A5F',
    info: '#0077B6',
    
    // Semantic Colors
    pending: '#F2C94C',
    approved: '#0077B6',
    rejected: '#E07A5F',
  },
  
  gradients: {
    primary: 'linear-gradient(90deg, #0077B6, #E07A5F)',
    success: 'linear-gradient(90deg, #0077B6, #4f9fc6)',
    danger: 'linear-gradient(90deg, #E07A5F, #c96a52)',
    info: 'linear-gradient(90deg, #F2C94C, #ddb73f)',
  },
  
  shadows: {
    card: '0 10px 30px rgba(61, 61, 61, 0.08)',
    cardHover: '0 20px 45px rgba(61, 61, 61, 0.12)',
    navbar: '0 12px 30px rgba(61, 61, 61, 0.08)',
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
