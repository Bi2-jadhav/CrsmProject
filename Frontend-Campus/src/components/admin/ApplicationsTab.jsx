import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Search, X, Eye, Download, FileText } from 'lucide-react'

const statusColor = {
    APPLIED: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
}

export default function ApplicationsTab() {
    const [applications, setApplications] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState(null)
    const { token } = useAuth()

    // Filters
    const [filterStatus, setFilterStatus] = useState('')
    const [filterSkills, setFilterSkills] = useState('')
    const [filterCollege, setFilterCollege] = useState('')
    const [filterBranch, setFilterBranch] = useState('')
    const [filterMinCGPA, setFilterMinCGPA] = useState('')
    const [searchName, setSearchName] = useState('')

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        setIsLoading(true)
        try {
            // Fetch all applications (admin endpoint)
            const data = await apiCall('/api/admin/applications', 'GET', null)
            setApplications(data || [])
        } catch (error) {
            toast.error('Failed to load applications')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredApplications = applications.filter((app) => {
        const matchStatus = !filterStatus || app.status === filterStatus
        const matchSkills = !filterSkills ||
            (app.skills || '').toLowerCase().includes(filterSkills.toLowerCase())
        const matchCollege = !filterCollege ||
            (app.college || '').toLowerCase().includes(filterCollege.toLowerCase())
        const matchBranch = !filterBranch ||
            (app.branch || '').toLowerCase().includes(filterBranch.toLowerCase())
        const matchCGPA = !filterMinCGPA ||
            (app.cgpa !== undefined && app.cgpa !== null && app.cgpa >= parseFloat(filterMinCGPA))
        const matchName = !searchName ||
            (app.studentName || app.studentEmail || '').toLowerCase().includes(searchName.toLowerCase()) ||
            (app.studentEmail || '').toLowerCase().includes(searchName.toLowerCase())
        return matchStatus && matchSkills && matchCollege && matchBranch && matchCGPA && matchName
    })

    const clearFilters = () => {
        setFilterStatus('')
        setFilterSkills('')
        setFilterCollege('')
        setFilterBranch('')
        setFilterMinCGPA('')
        setSearchName('')
    }

    return (
        <div className="space-y-6">

            {/* FILTERS */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search & Filter Applicants
                    </h3>
                    <Button variant="outline" size="sm" onClick={clearFilters} className="text-gray-600">
                        <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Search by name/email */}
                    <div className="relative lg:col-span-2">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search name / email..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="pl-9 text-sm"
                        />
                    </div>

                    {/* Filter by Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="APPLIED">Applied</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    {/* Filter by Min CGPA */}
                    <Input
                        type="number"
                        placeholder="Min CGPA (e.g. 7.5)"
                        value={filterMinCGPA}
                        onChange={(e) => setFilterMinCGPA(e.target.value)}
                        min="0" max="10" step="0.1"
                        className="text-sm"
                    />

                    {/* Filter by College */}
                    <Input
                        placeholder="College..."
                        value={filterCollege}
                        onChange={(e) => setFilterCollege(e.target.value)}
                        className="text-sm"
                    />

                    {/* Filter by Branch */}
                    <Input
                        placeholder="Branch..."
                        value={filterBranch}
                        onChange={(e) => setFilterBranch(e.target.value)}
                        className="text-sm"
                    />
                </div>

                {/* Skills filter */}
                <div className="mt-3">
                    <Input
                        placeholder="Filter by skills (e.g. Java, React)..."
                        value={filterSkills}
                        onChange={(e) => setFilterSkills(e.target.value)}
                        className="text-sm"
                    />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                    Showing <strong>{filteredApplications.length}</strong> of <strong>{applications.length}</strong> applications
                </p>
            </Card>

            {/* TABLE */}
            {isLoading ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-600">Loading applications...</p>
                </Card>
            ) : filteredApplications.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-gray-600">No applications found</p>
                </Card>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Student</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">College / Branch</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">CGPA</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Skills</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Job Role</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Applied Date</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Resume</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map((app) => (
                                <tr key={app.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{app.studentName || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{app.studentEmail}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-gray-800">{app.college || '—'}</div>
                                        <div className="text-xs text-gray-500">{app.branch || '—'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`font-semibold ${app.cgpa >= 8 ? 'text-green-700' : app.cgpa >= 6 ? 'text-yellow-700' : 'text-red-600'}`}>
                                            {app.cgpa != null ? app.cgpa : '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 max-w-[150px]">
                                        <div className="truncate text-gray-700 text-xs" title={app.skills}>{app.skills || '—'}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{app.jobRole || '—'}</td>
                                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                                        {app.appliedDate || '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge className={statusColor[app.status] || 'bg-gray-100 text-gray-800'}>
                                            {app.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {app.resumePath ? (
                                            <a
                                                href={`http://localhost:8080${app.resumePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                                            >
                                                <Download className="w-3 h-3" />
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedProfile(app)}
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                                        >
                                            <Eye className="w-3 h-3 mr-1" />
                                            View Profile
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PROFILE MODAL */}
            {selectedProfile && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={(e) => { if (e.target === e.currentTarget) setSelectedProfile(null) }}
                >
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            {(selectedProfile.studentName || selectedProfile.studentEmail || '?')[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg leading-tight">
                                            {selectedProfile.studentName || 'Unknown Student'}
                                        </h2>
                                        <p className="text-blue-100 text-sm">{selectedProfile.studentEmail}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedProfile(null)} className="text-white/80 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <InfoField label="College" value={selectedProfile.college} />
                                <InfoField label="Branch" value={selectedProfile.branch} />
                                <InfoField
                                    label="CGPA"
                                    value={selectedProfile.cgpa != null ? selectedProfile.cgpa : '—'}
                                    highlight={selectedProfile.cgpa >= 8 ? 'green' : selectedProfile.cgpa >= 6 ? 'yellow' : 'red'}
                                />
                                <InfoField label="Applied Date" value={selectedProfile.appliedDate} />
                                <InfoField label="Job Role" value={selectedProfile.jobRole} />
                                <InfoField label="Company" value={selectedProfile.companyName} />
                            </div>
                            <InfoField label="Skills" value={selectedProfile.skills} full />
                            <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-sm text-gray-600">Application Status</span>
                                <Badge className={statusColor[selectedProfile.status] || 'bg-gray-100 text-gray-800'}>
                                    {selectedProfile.status}
                                </Badge>
                            </div>
                            {selectedProfile.resumePath && (
                                <a
                                    href={`http://localhost:8082${selectedProfile.resumePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    View / Download Resume
                                </a>
                            )}
                        </div>

                        <div className="px-6 pb-5">
                            <Button onClick={() => setSelectedProfile(null)} className="w-full" variant="outline">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function InfoField({ label, value, highlight, full }) {
    const colorMap = { green: 'text-green-700 font-bold', yellow: 'text-yellow-700 font-bold', red: 'text-red-600 font-bold' }
    return (
        <div className={full ? 'col-span-2' : ''}>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-sm text-gray-900 ${highlight ? colorMap[highlight] : ''}`}>
                {value || '—'}
            </p>
        </div>
    )
}
