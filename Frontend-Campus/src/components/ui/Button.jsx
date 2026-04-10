import React from 'react'

export function Button({ children, variant = 'default', size = 'md', className = '', ...props }) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-indigo-200/50 hover:-translate-y-0.5',
    outline: 'border-2 border-slate-200 text-slate-700 bg-white/50 hover:border-primary/30 hover:text-primary hover:bg-white hover:shadow-md hover:-translate-y-0.5',
    ghost: 'hover:bg-slate-100/80 text-slate-600 hover:text-slate-900',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

