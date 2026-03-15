import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../../context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'

export default function ApplicationsTab() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const auth = useAuth()
  const token = auth?.token

  useEffect(() => {
    if (token) fetchApplications()
  }, [token])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const data = await apiCall('/api/student/applications', 'GET')
      setApplications(data || [])
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => ({
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800')

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card className="p-8 text-center">Loading applications...</Card>
      ) : applications.length === 0 ? (
        <Card className="p-8 text-center">
          No applications yet. Start applying!
        </Card>
      ) : (
        applications.map(app => (
          <Card key={app.id} className="p-6">
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold">{app.jobRole}</h3>
                <p className="text-gray-600">{app.companyName}</p>
              </div>
              <Badge className={getStatusColor(app.status)}>
                {app.status}
              </Badge>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Applied on {new Date(app.appliedDate).toLocaleDateString()}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}
