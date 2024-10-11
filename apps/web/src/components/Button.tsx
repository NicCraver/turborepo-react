import React from 'react';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'rounded px-2 py-1 text-xs',
  sm: 'rounded px-2 py-1 text-sm',
  md: 'rounded-md px-2.5 py-1.5 text-sm',
  lg: 'rounded-md px-3 py-2 text-sm',
  xl: 'rounded-md px-3.5 py-2.5 text-sm',
};

const Button: React.FC<ButtonProps> = ({ 
  size = 'lg', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
  const sizeClass = sizeClasses[size];
  const combinedClasses = `${baseClasses} ${sizeClass} ${className}`.trim();

  return (
    <button
      type="button"
      className={`bg-indigo-600 ${combinedClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;