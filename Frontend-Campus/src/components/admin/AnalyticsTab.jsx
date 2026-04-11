import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Briefcase, Users, CheckCircle, XCircle, Clock } from 'lucide-react'

// ✅ Recharts Imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

export default function AnalyticsTab() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
    totalStudents: 0,
    totalCompanies: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await apiCall('/api/admin/dashboard', 'GET', null, token)
      if (data) {
        setStats({
          totalJobs: data.totalJobs || 0,
          totalApplications: data.totalApplications || 0,
          acceptedCount: data.acceptedCount || 0,
          rejectedCount: data.rejectedCount || 0,
          pendingCount: data.pendingCount || 0,
          totalStudents: data.totalStudents || 0,
          totalCompanies: data.totalCompanies || 0,
        })
      }
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color, textColor }) => (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${textColor || 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </Card>
  )

  // ✅ Chart Data
  const applicationStatusData = [
    { name: 'Accepted', value: stats.acceptedCount },
    { name: 'Rejected', value: stats.rejectedCount },
    { name: 'Pending', value: stats.pendingCount },
  ]

  const jobStatsData = [
    { name: 'Jobs', value: stats.totalJobs },
    { name: 'Applications', value: stats.totalApplications },
  ]

  const COLORS = ['#22C55E', '#F59E0B', '#EF4444'] // green, amber, red

  return (
    <div className="space-y-8">
      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading analytics...</p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={Briefcase} label="Total Jobs Posted" value={stats.totalJobs} color="bg-purple-600" />
            <StatCard icon={Users} label="Total Applicants" value={stats.totalApplications} color="bg-blue-600" />
            <StatCard icon={CheckCircle} label="Accepted Candidates" value={stats.acceptedCount} color="bg-green-600" textColor="text-green-700" />
            <StatCard icon={XCircle} label="Rejected Candidates" value={stats.rejectedCount} color="bg-red-600" textColor="text-red-700" />
            <StatCard icon={Clock} label="Pending Applications" value={stats.pendingCount} color="bg-orange-500" textColor="text-orange-700" />
          </div>

          {/* Platform Summary */}
          <Card className="p-8 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Platform Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span>Registered Students</span>
                <span>{stats.totalStudents}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span>Registered Companies</span>
                <span>{stats.totalCompanies}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span>Total Jobs</span>
                <span>{stats.totalJobs}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span>Total Applications</span>
                <span>{stats.totalApplications}</span>
              </div>
              <div className="flex justify-between">
                <span>Acceptance Rate</span>
                <span className="text-green-600 font-semibold">
                  {stats.totalApplications > 0
                    ? ((stats.acceptedCount / stats.totalApplications) * 100).toFixed(1) + '%'
                    : '0%'}
                </span>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <Card className="p-8 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p>Avg Applications per Job</p>
                <p className="text-3xl font-bold">
                  {stats.totalJobs > 0 ? (stats.totalApplications / stats.totalJobs).toFixed(1) : 0}
                </p>
              </div>
              <div>
                <p>Jobs per Company</p>
                <p className="text-3xl font-bold">
                  {stats.totalCompanies > 0 ? (stats.totalJobs / stats.totalCompanies).toFixed(1) : 0}
                </p>
              </div>
              <div>
                <p>Placement Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalStudents > 0
                    ? ((stats.acceptedCount / stats.totalStudents) * 100).toFixed(1) + '%'
                    : '0%'}
                </p>
              </div>
            </div>
          </Card>

          {/* ✅ Charts Section */}
          <Card className="p-8 shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Analytics Charts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Bar Chart */}
              <div>
                <h3 className="mb-4 font-semibold">Jobs vs Applications</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobStatsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div>
                <h3 className="mb-4 font-semibold">Application Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </Card>
        </>
      )}
    </div>
  )
}