import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Briefcase, MapPin, DollarSign, Search } from 'lucide-react'

export default function JobsTab() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      // ✅ Correct endpoint for listing jobs
      const data = await apiCall('/api/internal/jobs')
      setJobs(data || [])
    } catch (error) {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async (job) => {
    try {
      // Send JobApplication object with required fields
      const applicationData = {
        companyId: job.id,
        companyName: job.companyName,
        packageOffered: job.ctc
      }
      await apiCall('/api/student/applications', 'POST', applicationData)
      toast.success('Applied to job successfully!')
      // Optionally refresh jobs list to update UI
      fetchJobs()
    } catch (error) {
      // Check for duplicate application error
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to apply for job'

      if (errorMessage.includes('already applied')) {
        toast.error('You have already applied to this company')
      } else {
        toast.error(errorMessage)
      }
    }
  }


  // ✅ Correct filtering based on backend fields
  const filteredJobs = jobs.filter((job) =>
    job.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by job role or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading jobs...</p>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No jobs found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {/* JOB ROLE */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {job.jobRole}
                  </h3>

                  {/* COMPANY NAME */}
                  <p className="text-gray-600 mb-3">
                    🏢 {job.companyName}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{job.ctc}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.skills}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-3">
                    <strong>Eligibility:</strong> {job.eligibility}
                  </p>
                </div>

                <Button
                  onClick={() => handleApply(job)}
                  className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
                >
                  Apply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
