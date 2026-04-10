import React from 'react'

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border border-slate-100/80 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-8 ${className}`}>{children}</div>
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-8 pb-0 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-2xl font-black text-slate-900 tracking-tight ${className}`}>{children}</h2>
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-slate-500 font-medium mt-1 ${className}`}>{children}</p>
}

