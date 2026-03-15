import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs'
import JobListingsTab from '../components/company/JobListingsTab'
import ApplicantsTab from '../components/company/ApplicantsTab'
import PostJobTab from '../components/company/PostJobTab'

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Company Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your job listings and applicants
          </p>
        </div>

        {/* ✅ UNCONTROLLED Tabs (matches your Tabs.jsx) */}
        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="post">Post Job</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <JobListingsTab />
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantsTab />
          </TabsContent>

          <TabsContent value="post">
            <PostJobTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
