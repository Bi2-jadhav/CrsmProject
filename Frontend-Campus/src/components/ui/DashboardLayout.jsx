import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from '../Navbar'
import { useAuth } from '@/context/AuthContext'
import { Menu } from 'lucide-react'

export default function DashboardLayout({ items, activeItem, onItemClick, children }) {
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-[120] transition-all duration-300 ease-in-out h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <Sidebar 
          items={items} 
          activeItem={activeItem} 
          onItemClick={(id) => {
            onItemClick(id)
            setIsMobileOpen(false)
          }} 
          user={user}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Dashboard Header / Top Nav */}
        <header className="h-20 glass border-b flex items-center justify-between px-6 sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-slate-800 leading-none">Dashboard</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Campus Recruitment Management System
              </p>
            </div>
          </div>

          {/* We can integrate more actions here (Notifications, Profile toggle) */}
          <Navbar isDashboard={true} />
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto px-6 py-10 sm:px-10 lg:px-12 bg-transparent custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


