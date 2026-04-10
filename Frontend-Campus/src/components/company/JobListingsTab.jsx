import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Trash2, MapPin, DollarSign, Users, Code, Briefcase } from 'lucide-react'

export default function JobListingsTab() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

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
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return

    setDeletingId(id)
    try {
      await apiCall(`/api/internal/jobs/${id}`, 'DELETE')
      toast.success('Job deleted successfully')
      fetchJobs()
    } catch (error) {
      toast.error('Failed to delete job')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-gray-600 font-medium">Loading job listings...</p>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className="p-12 text-center border-0 shadow-lg">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-semibold mb-2">No jobs posted yet</p>
        <p className="text-gray-500">Start by posting your first job to attract talented candidates</p>
      </Card>
    )
  }

  return (
    <div>
      {/* Stats Header */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-gray-700">
          📊 Total Active Jobs: <span className="text-lg text-blue-600">{jobs.length}</span>
        </p>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Job Content */}
              <div className="flex-1">
                {/* Title and Company */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.jobRole}</h3>
                    <p className="text-sm text-gray-600">{job.companyName || 'Your Company'}</p>
                  </div>
                </div>

                {/* Location and CTC */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>₹{Number(job.ctc).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Eligibility: {job.eligibility}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    {job.rounds} Round{job.rounds !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Skills */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteJob(job.id)}
                disabled={deletingId === job.id}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 self-start sm:self-auto flex items-center gap-2"
              >
                {deletingId === job.id ? (
                  <>
                    <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
