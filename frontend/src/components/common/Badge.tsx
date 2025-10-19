/**
 * Badge Component
 * For displaying status indicators and labels
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'rag-red' | 'rag-amber' | 'rag-green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantClasses = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  'rag-red': 'bg-red-500 text-white border-red-600',
  'rag-amber': 'bg-amber-500 text-white border-amber-600',
  'rag-green': 'bg-green-500 text-white border-green-600'
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base'
};

/**
 * Badge Component
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
