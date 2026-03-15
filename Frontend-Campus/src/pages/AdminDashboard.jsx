
import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import UsersTab from '../components/admin/UsersTab'
import CompaniesTab from '../components/admin/CompaniesTab'
import AnalyticsTab from '../components/admin/AnalyticsTab'
import ApplicationsTab from '../components/admin/ApplicationsTab'
import AdminJobsTab from '../components/admin/AdminJobsTab'

export default function AdminDashboard() {
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
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationsTab />
          </TabsContent>
          <TabsContent value="jobs">
            <AdminJobsTab />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="companies">
            <CompaniesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
