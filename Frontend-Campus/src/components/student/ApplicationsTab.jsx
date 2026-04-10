import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '../../context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const auth = useAuth()
  const token = auth?.token

  useEffect(() => {
    if (token) fetchApplications('ALL')
  }, [token])

  // ✅ Normalize status (fix mismatch issue)
  const normalizeStatus = (status) => {
    return status?.toUpperCase()?.trim()
  }

  // ✅ Fetch applications
  const fetchApplications = async (status) => {
    setIsLoading(true)
    try {
      let url = '/api/student/applications'

      if (status !== 'ALL') {
        url = `/api/student/applications/status/${status}`
      }

      const data = await apiCall(url, 'GET')

      // normalize all statuses from backend
      const normalizedData = (data || []).map(app => ({
        ...app,
        status: normalizeStatus(app.status)
      }))

      setApplications(normalizedData)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Filter handler
  const handleFilterChange = (status) => {
    setStatusFilter(status)
    fetchApplications(status)
  }

  // ✅ STATUS COLORS
  const getStatusColor = (status) => ({
    APPLIED: 'bg-yellow-100 text-yellow-800',
    SHORTLISTED: 'bg-blue-100 text-blue-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    SELECTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800')

  // ✅ TIMELINE (safe)
  const Timeline = ({ status }) => {
    const steps = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED']
    const currentIndex = steps.indexOf(status)

    return (
      <div className="flex gap-2 mt-3 text-xs flex-wrap">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`px-2 py-1 rounded ${
              currentIndex >= index
                ? 'bg-green-200'
                : 'bg-gray-200'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    )
  }

  // ✅ Date format fix
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
  }

  // ✅ Countdown
  const getCountdown = (date) => {
    if (!date) return null
    const diff = new Date(date) - new Date()
    if (diff <= 0) return 'Started'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff / (1000 * 60)) % 60)

    return `${hours}h ${minutes}m left`
  }

  return (
    <div className="space-y-6">

      {/* 🔥 FILTER BUTTONS */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map(s => (
          <Button
            key={s}
            variant={statusFilter === s ? 'default' : 'outline'}
            onClick={() => handleFilterChange(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          Loading applications...
        </Card>
      ) : applications.length === 0 ? (
        <Card className="p-8 text-center">
          No applications found
        </Card>
      ) : (
        applications.map(app => (
          <Card key={app.id} className="p-6">

            {/* HEADER */}
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">
                  {app.jobRole || 'N/A'}
                </h3>
                <p className="text-gray-600">
                  {app.companyName || 'N/A'}
                </p>
              </div>

              <Badge className={getStatusColor(app.status)}>
                {app.status}
              </Badge>
            </div>

            {/* DATE */}
            <div className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Applied on {formatDate(app.appliedDate)}
            </div>

            {/* TIMELINE */}
            <Timeline status={app.status} />

            {/* INTERVIEW DETAILS */}
            {app.status === 'INTERVIEW' && app.interviewDate && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p>
                  <b>Interview Date:</b>{' '}
                  {new Date(app.interviewDate).toLocaleString()}
                </p>
                <p><b>Round:</b> {app.round || 'Technical'}</p>
                <p><b>Mode:</b> {app.mode || 'Online'}</p>

                <p className="text-red-600 font-semibold mt-1">
                  {getCountdown(app.interviewDate)}
                </p>
              </div>
            )}

          </Card>
        ))
      )}
    </div>
  )
}