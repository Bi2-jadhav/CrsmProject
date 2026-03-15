import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

export default function JobListingsTab() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const data = await apiCall('/api/company/jobs')
      setJobs(data || [])
    } catch (error) {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return

    try {
      await apiCall(`/api/internal/jobs/${id}`, 'DELETE')
      toast.success('Job deleted')
      fetchJobs()
    } catch (error) {
      toast.error('Failed to delete job')
    }
  }

  if (loading) {
    return <p className="text-gray-600">Loading jobs...</p>
  }

  if (jobs.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-600">
        No jobs posted yet
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="p-6">
          <div className="flex justify-between items-start">
            {/* LEFT SIDE */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {job.jobRole}
              </h3>

              <p className="text-gray-600 mt-1">
                📍 {job.location} &nbsp; | &nbsp; 💰 ₹{job.ctc}
              </p>

              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge variant="secondary">
                  Eligibility: {job.eligibility}
                </Badge>
                <Badge variant="secondary">
                  Rounds: {job.rounds}
                </Badge>
              </div>

              <p className="text-sm text-gray-700 mt-3">
                <strong>Skills:</strong> {job.skills}
              </p>
            </div>

            {/* DELETE BUTTON */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteJob(job.id)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
