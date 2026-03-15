

import React from 'react'
import { X } from 'lucide-react'

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onOpenChange })
        )}
      </div>
    </div>
  )
}

export function DialogContent({ children, onOpenChange }) {
  return (
    <div className="relative">
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>
}
