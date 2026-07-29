import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/30',
  secondary: 'bg-surface text-text border border-border hover:bg-border-light focus-visible:ring-primary/20',
  danger: 'bg-error text-white hover:bg-red-700 focus-visible:ring-error/30',
  ghost: 'text-text-secondary hover:bg-border-light hover:text-text focus-visible:ring-primary/20',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3 rounded-xl',
};

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', className = '', disabled, loading, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
