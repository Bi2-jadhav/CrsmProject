import React, { useState } from 'react'
import { Briefcase, FileText, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext' // ✅ ADD THIS
import { Navigate } from 'react-router-dom' // ✅ ADD THIS

import DashboardLayout from '../components/ui/DashboardLayout'
import JobsTab from '../components/student/JobsTab'
import ApplicationsTab from '../components/student/ApplicationsTab'
import ProfileTab from '../components/student/ProfileTab'

export default function StudentDashboard() {
  const { authReady, token } = useAuth() // ✅ IMPORTANT

  const [activeTab, setActiveTab] = useState('jobs')

  const sidebarItems = [
    { id: 'jobs', label: 'Explore Careers', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'profile', label: 'Student Profile', icon: User },
  ]

  // 🔥 WAIT until auth is loaded
  if (!authReady) {
    return <div className="p-10 text-center">Loading...</div>
  }

  // 🔥 REDIRECT only AFTER authReady
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <DashboardLayout
      items={sidebarItems}
      activeItem={activeTab}
      onItemClick={setActiveTab}
    >
      <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {sidebarItems.find(i => i.id === activeTab)?.label}
        </h1>
        <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
          <span className="w-8 h-0.5 bg-primary rounded-full" />
          Manage your job placement journey and track your applications.
        </p>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-white p-10 min-h-[700px] mb-10 transition-all duration-500">
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </DashboardLayout>
  )
}