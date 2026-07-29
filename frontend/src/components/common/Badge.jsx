export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-border-light text-text-secondary',
    primary: 'bg-primary-light text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    error: 'bg-error-light text-error',
    lost: 'bg-orange-50 text-orange-700 border border-orange-200',
    found: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
