import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'

export default function ApplicantsTab() {
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)

  // 🔹 Load company jobs
  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const data = await apiCall('/api/company/jobs')
      setJobs(data || [])
    } catch {
      toast.error('Failed to load jobs')
    }
  }

  // 🔹 Load applicants for selected job
  const loadApplicants = async (jobId) => {
    if (!jobId) return
    setLoading(true)

    try {
      const data = await apiCall(`/api/company/applications/${jobId}`)
      setApplicants(data || [])
    } catch {
      toast.error('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicationId, status) => {
    try {
      await apiCall(
        `/api/company/applications/${applicationId}?status=${status}`,
        'PUT'
      )
      toast.success(`Application ${status.toLowerCase()}`)
      loadApplicants(selectedJobId)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const statusColor = {
    APPLIED: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">

      {/* JOB SELECT */}
      <select
        value={selectedJobId}
        onChange={(e) => {
          setSelectedJobId(e.target.value)
          loadApplicants(e.target.value)
        }}
        className="w-full border rounded-lg px-3 py-2"
      >
        <option value="">Select Job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.jobRole}
          </option>
        ))}
      </select>

      {/* CONTENT */}
      {loading ? (
        <Card className="p-6 text-center">Loading applicants...</Card>
      ) : applicants.length === 0 ? (
        <Card className="p-6 text-center">No applicants</Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id} className="border-b">
                  <td className="px-4 py-2">{app.studentName || app.studentEmail || 'N/A'}</td>
                  <td className="px-4 py-2">{app.studentEmail}</td>
                  <td className="px-4 py-2">
                    <Badge className={statusColor[app.status]}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {(app.status === 'PENDING' || app.status === 'APPLIED') && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(app.id, 'ACCEPTED')}
                          className="bg-green-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(app.id, 'REJECTED')}
                          className="bg-red-600 text-white"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
