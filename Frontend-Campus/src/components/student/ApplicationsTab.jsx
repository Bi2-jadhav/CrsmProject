
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
  const [interviews, setInterviews] = useState({})
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const auth = useAuth()
  const token = auth?.token

  // ✅ Normalize status
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

  // ✅ FIXED: Fetch interviews safely
  const fetchInterviews = async () => {
try {
let user = JSON.parse(localStorage.getItem('user'))


// 🔥 Ensure user object exists
if (!user) {
  console.error("User not found in localStorage ❌")
  return
}

// 🔥 Fetch ID if missing
if (!user?.id) {
  console.warn("user.id missing → fetching profile")

  const profile = await apiCall('/api/student/profile')

  if (profile?.id) {
    user = { ...user, id: profile.id }
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    console.error("Profile ID not found ❌")
    return
  }
}

console.log("Fetching interviews for Candidate ID:", user.id)

const data = await apiCall(`/api/interviews/candidate/${user.id}`)

console.log("Interview Response:", data)

const map = {}
;(data || []).forEach(i => {
  map[i.jobId] = i
})

setInterviews(map)


} catch (err) {
console.error('Interview fetch failed ❌', err)
}
}


  // ✅ Load data
  useEffect(() => {
if (token) {
fetchApplications('ALL')


// 🔥 ALWAYS call this (it handles ID internally)
fetchInterviews()


}
}, [token])


  // ✅ Filter handler
  const handleFilterChange = (status) => {
    setStatusFilter(status)
    fetchApplications(status)
  }

  // ✅ Status colors
  const getStatusColor = (status) => ({
    APPLIED: 'bg-yellow-100 text-yellow-800',
    SHORTLISTED: 'bg-blue-100 text-blue-800',
    INTERVIEW: 'bg-purple-100 text-purple-800',
    SELECTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800')

  // ✅ Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()
  }

  return (
    <div className="space-y-6">

      {/* FILTER BUTTONS */}
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
        applications.map(app => {

          // 🔥 FIX: Mapping using jobId
          const interview = interviews[app.jobId]

          return (
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

              {/* INTERVIEW DETAILS */}
              {app.status === 'INTERVIEW' && interview && (
                <div className="mt-5 p-4 border rounded-xl bg-purple-50">
                  <p><strong>Type:</strong> {interview.interviewType}</p>
                  <p><strong>Date:</strong> {new Date(interview.interviewDateTime).toLocaleString()}</p>
                  <p><strong>Interviewer:</strong> {interview.interviewerName}</p>

                  {interview.mode === 'Online' && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Join Meeting
                    </a>
                  )}

                  {interview.mode === 'Offline' && (
                    <>
                      <p><strong>Location:</strong> {interview.location}</p>
                      <p><strong>Address:</strong> {interview.address}</p>
                    </>
                  )}
                </div>
              )}

              {/* NO INTERVIEW */}
              {app.status === 'INTERVIEW' && !interview && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl text-center">
                  Interview not scheduled yet
                </div>
              )}

            </Card>
          )
        })
      )}
    </div>
  )
}

