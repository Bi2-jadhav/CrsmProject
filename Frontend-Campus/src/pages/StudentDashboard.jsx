import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import JobsTab from '../components/student/JobsTab'
import ApplicationsTab from '../components/student/ApplicationsTab'
import ProfileTab from '../components/student/ProfileTab'

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your job applications and profile
          </p>
        </div>

        {/* ✅ Tabs controls its own state */}
        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs">
              Available Jobs
            </TabsTrigger>
            <TabsTrigger value="applications">
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobsTab />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTab />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
