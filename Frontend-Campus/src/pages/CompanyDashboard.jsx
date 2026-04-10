import React, { useState } from 'react'
import { Briefcase, Users, PlusCircle } from 'lucide-react'
import DashboardLayout from '../components/ui/DashboardLayout'
import JobListingsTab from '../components/company/JobListingsTab'
import ApplicantsTab from '../components/company/ApplicantsTab'
import PostJobTab from '../components/company/PostJobTab'

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('jobs')

  const sidebarItems = [
    { id: 'jobs', label: 'My Job Posts', icon: Briefcase },
    { id: 'applicants', label: 'Candidate Applications', icon: Users },
    { id: 'post', label: 'Create New Listing', icon: PlusCircle },
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
          Streamline your recruitment process and manage job applications.
        </p>
      </div>

      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-white p-10 min-h-[700px] mb-10 transition-all duration-500">
        {activeTab === 'jobs' && <JobListingsTab />}
        {activeTab === 'applicants' && <ApplicantsTab />}
        {activeTab === 'post' && <PostJobTab />}
      </div>
    </DashboardLayout>
  )
}

