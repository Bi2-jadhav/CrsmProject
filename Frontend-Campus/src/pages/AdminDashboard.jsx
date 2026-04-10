import React, { useState } from 'react'
import { LayoutDashboard, FileText, Briefcase, Users, Building } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import UsersTab from '../components/admin/UsersTab'
import CompaniesTab from '../components/admin/CompaniesTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import ApplicationsTab from '../components/admin/ApplicationsTab'
import AdminJobsTab from '../components/admin/AdminJobsTab'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')

  const sidebarItems = [
    { id: 'analytics', label: 'System Analytics', icon: LayoutDashboard },
    { id: 'applications', label: 'Global Applications', icon: FileText },
    { id: 'jobs', label: 'Job Management', icon: Briefcase },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'companies', label: 'Company Partners', icon: Building },
  ]

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
          Full system administration and global recruitment overview.
        </p>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-white p-10 min-h-[700px] mb-10 transition-all duration-500">
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        {activeTab === 'jobs' && <AdminJobsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'companies' && <CompaniesTab />}
      </div>
    </DashboardLayout>
  )
}

