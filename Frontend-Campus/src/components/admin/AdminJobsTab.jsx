import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Search, ToggleLeft, ToggleRight, Lock, Unlock, Trash2 } from 'lucide-react'

export default function AdminJobsTab() {
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [togglingId, setTogglingId] = useState(null)
    const { token } = useAuth()

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        setIsLoading(true)
        try {
            const data = await apiCall('/api/admin/jobs', 'GET', null, token)
            setJobs(data || [])
        } catch (error) {
            toast.error('Failed to load jobs')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleStatus = async (job) => {
        const newStatus = (job.jobStatus || 'OPEN') === 'OPEN' ? 'CLOSED' : 'OPEN'
        setTogglingId(job.id)
        try {
            await apiCall(
                `/api/admin/jobs/${job.id}/status?status=${newStatus}`,
                'PUT',
                null,
                token
            )
            toast.success(`Job "${job.jobRole}" is now ${newStatus}`)
            fetchJobs()
        } catch (error) {
            toast.error('Failed to update job status')
        } finally {
            setTogglingId(null)
        }
    }

    const handleDelete = async (jobId, jobRole) => {
        if (!window.confirm(`Delete job "${jobRole}"?`)) return
        try {
            await apiCall(`/api/admin/jobs/${jobId}`, 'DELETE', null, token)
            toast.success('Job deleted')
            fetchJobs()
        } catch {
            toast.error('Failed to delete job')
        }
    }

    const filteredJobs = jobs.filter((job) => {
        const matchSearch = !search ||
            (job.jobRole || '').toLowerCase().includes(search.toLowerCase()) ||
            (job.companyName || '').toLowerCase().includes(search.toLowerCase())
        const matchStatus = !filterStatus || (job.jobStatus || 'OPEN') === filterStatus
        return matchSearch && matchStatus
    })

    return (
        <div className="space-y-6">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by job role or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                >
                    <option value="">All Statuses</option>
                    <option value="OPEN">🟢 Open</option>
                    <option value="CLOSED">🔴 Closed</option>
                </select>
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
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Job Role</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Company</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">CTC (LPA)</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Skills</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map((job) => {
                                const isOpen = (job.jobStatus || 'OPEN') === 'OPEN'
                                return (
                                    <tr key={job.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{job.jobRole}</td>
                                        <td className="px-4 py-3 text-gray-700">{job.companyName || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{job.location || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {job.ctc ? `₹${job.ctc} LPA` : '—'}
                                        </td>
                                        <td className="px-4 py-3 max-w-[160px]">
                                            <div className="truncate text-gray-600 text-xs" title={job.skills}>{job.skills || '—'}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                            >
                                                {isOpen ? '🟢 Open' : '🔴 Closed'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 space-x-2 flex items-center">
                                            <Button
                                                size="sm"
                                                onClick={() => handleToggleStatus(job)}
                                                disabled={togglingId === job.id}
                                                className={
                                                    isOpen
                                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }
                                            >
                                                {isOpen ? (
                                                    <><Lock className="w-3 h-3 mr-1" /> Close Job</>
                                                ) : (
                                                    <><Unlock className="w-3 h-3 mr-1" /> Open Job</>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(job.id, job.jobRole)}
                                                className="border-red-300 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <p className="text-xs text-gray-400">
                Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs
            </p>
        </div>
    )
}
