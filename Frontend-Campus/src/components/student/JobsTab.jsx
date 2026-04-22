
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Briefcase, MapPin, DollarSign, Search } from 'lucide-react'

export default function JobsTab() {
  const [jobs, setJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
    fetchApplications()
  }, [])

  // ✅ Load jobs
  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const data = await apiCall('/api/internal/jobs')
      setJobs(data || [])
    } catch {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Load applied jobs
  const fetchApplications = async () => {
    try {
      const data = await apiCall('/api/student/applications')
      const jobIds = (data || []).map(app => app.jobId)
      setAppliedJobs(jobIds)
    } catch {
      console.error('Failed to fetch applications')
    }
  }

  // 🔥 FIXED APPLY FUNCTION
  const handleApply = async (job) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))

      const applicationData = {
        studentId: user?.id,       // ✅ FIXED
        studentEmail: user?.email, // ✅ Added for robustness
        jobId: job.id,             // ✅ REQUIRED
        jobRole: job.jobRole,      // 🔥 ADDED for history
        companyId: job.companyId,  // ✅ REQUIRED
        companyName: job.companyName, // 🔥 ADDED for history
        status: 'APPLIED'
      }

      await apiCall('/api/student/applications', 'POST', applicationData) 

      toast.success('Applied successfully!')

      // update UI instantly
      setAppliedJobs(prev => [...prev, job.id])

    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to apply'

      toast.error(msg)
    }
  }

  // 🔍 Filter jobs
  const filteredJobs = jobs.filter(job =>
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
          Loading jobs...
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          No jobs found
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => {

            const alreadyApplied = appliedJobs.includes(job.id)

            return (
              <Card key={job.id} className="p-6 hover:shadow-md">

                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">

                    <h3 className="text-xl font-semibold">
                      {job.jobRole}
                    </h3>

                    <p className="text-gray-600 mb-3">
                      🏢 {job.companyName}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>

                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{job.ctc}
                      </div>

                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.skills}
                      </div>
                    </div>

                    <p className="text-sm mt-2">
                      <b>Eligibility:</b> {job.eligibility}
                    </p>
                  </div>

                  {/* APPLY BUTTON */}
                  <Button
                    onClick={() => handleApply(job)}
                    disabled={alreadyApplied}
                    className={`ml-4 ${
                      alreadyApplied
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {alreadyApplied ? 'Applied' : 'Apply'}
                  </Button>

                </div>

              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

