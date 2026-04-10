
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/Button'
import { LogOut, User, Layout, Bell, Settings, Search } from 'lucide-react'
import { toast } from 'sonner'

export default function Navbar({ isDashboard = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (isDashboard) {
    return (
      <div className="flex items-center gap-4">
        {/* Search Bar - SaaS Style */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100/50 border border-slate-200 w-64 group focus-within:bg-white focus-within:border-primary/30 transition-all">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="bg-transparent border-none text-xs font-semibold focus:outline-none w-full placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors relative group">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
          </button>
          
          <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors group">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-xs font-black text-slate-900 leading-none">
              {user?.name || 'User'}
            </span>
            <span className="text-[9px] font-bold text-primary tracking-widest uppercase mt-1">
              {user?.role}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold border-2 border-white shadow-lg shadow-indigo-100 hover:scale-105 transition-transform"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Standard Landing Navbar
  return (
    <nav className="glass border-b sticky top-0 z-[100] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group transition-all duration-300"
          >
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
              <Layout className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold gradient-text tracking-tight leading-none">
                CAMPUS
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">
                Recruitment Portal
              </span>
            </div>
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/50 border border-white/50 shadow-sm transition-all hover:shadow-md">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {user?.name || user?.email}
                </span>
                <span className="text-[9px] font-bold text-primary tracking-wider uppercase mt-0.5">
                  {user?.role}
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="group flex items-center gap-2 bg-white/80 border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-xl px-5"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}


