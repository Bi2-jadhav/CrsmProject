
import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import UsersTab from '../components/admin/UsersTab'
import CompaniesTab from '../components/admin/CompaniesTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import ApplicationsTab from '../components/admin/ApplicationsTab'
import AdminJobsTab from '../components/admin/AdminJobsTab'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, companies, jobs, applications and view analytics
          </p>
        </div>

        <Tabs defaultValue="analytics">
          <TabsList>
            <TabsTrigger value="analytics" activeTab={activeTab} setActiveTab={setActiveTab}>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="applications" activeTab={activeTab} setActiveTab={setActiveTab}>
              Applications
            </TabsTrigger>
            <TabsTrigger value="jobs" activeTab={activeTab} setActiveTab={setActiveTab}>
              Jobs
            </TabsTrigger>
            <TabsTrigger value="users" activeTab={activeTab} setActiveTab={setActiveTab}>
              Users
            </TabsTrigger>
            <TabsTrigger value="companies" activeTab={activeTab} setActiveTab={setActiveTab}>
              Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" activeTab={activeTab}>
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="applications" activeTab={activeTab}>
            <ApplicationsTab />
          </TabsContent>
          <TabsContent value="jobs" activeTab={activeTab}>
            <AdminJobsTab />
          </TabsContent>
          <TabsContent value="users" activeTab={activeTab}>
            <UsersTab />
          </TabsContent>
          <TabsContent value="companies" activeTab={activeTab}>
            <CompaniesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
