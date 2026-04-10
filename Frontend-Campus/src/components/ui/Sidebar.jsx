import React from 'react'
import { 
  LayoutDashboard, 
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Layout,
  Bell
} from 'lucide-react'

export default function Sidebar({ items, activeItem, onItemClick, user, isCollapsed, setIsCollapsed }) {
  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-64'} 
      bg-slate-900 h-screen flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800
    `}>
      
      {/* Sidebar Header / Logo Section */}
      <div className={`h-20 flex items-center px-6 border-b border-slate-800/50 mb-4 overflow-hidden`}>
        <div className="flex items-center gap-3 min-w-max">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Layout className="text-white w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-xl font-black text-white tracking-tight leading-none">
                CAMPUS
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-0.5 whitespace-nowrap">
                Recruitment
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const Icon = item.icon || LayoutDashboard
          const isActive = activeItem === item.id

          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`
                w-full flex items-center rounded-xl transition-all duration-300 group relative
                ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3.5 gap-4'}
                ${isActive
                  ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(79,70,229,0.2)]'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
              )}
              
              <Icon className={`shrink-0 w-5 h-5 transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'
              }`} />
              
              {!isCollapsed && (
                <span className="font-bold tracking-wide text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 transition-all">
                  {item.label}
                </span>
              )}

              {isActive && !isCollapsed && (
                <div className="ml-auto bg-primary/20 p-1 rounded-md">
                  <ChevronRight className="w-3 h-3 text-primary" />
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* Toggle Button Container */}
      <div className="p-3 border-t border-slate-800/50">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            w-full flex items-center justify-center p-3 rounded-xl 
            bg-slate-800/30 text-slate-500 hover:bg-slate-800 hover:text-slate-200 
            transition-all border border-slate-800/50
          `}
        >
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* User Info / Footer */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-950/20">
        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center p-1' : 'px-2 py-2'}`}>
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold border-2 border-slate-800 shadow-xl">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full" />
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <p className="text-xs font-black text-slate-100 truncate uppercase tracking-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-widest mt-0.5">
                {user?.role || 'Member'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}


