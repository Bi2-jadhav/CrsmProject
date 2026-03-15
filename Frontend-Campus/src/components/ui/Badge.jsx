export function Badge({ children, className = '' }) {
  const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium inline-flex items-center'
  return <span className={`${baseClasses} ${className}`}>{children}</span>
}
