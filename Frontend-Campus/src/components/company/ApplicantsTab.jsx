import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Users, FileText, CheckCircle, XCircle, Clock, ChevronRight, Video, MapPin, Calendar, X } from 'lucide-react'

export default function ApplicantsTab() {

  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(false)

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  // 🔥 Interview scheduling state
  const [showInterviewForm, setShowInterviewForm] = useState(false)
  const [interviewTarget, setInterviewTarget] = useState(null)
  const [interviewSubmitting, setInterviewSubmitting] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    interviewType: 'Technical',
    mode: 'Online',
    interviewDateTime: '',
    interviewerName: '',
    meetingLink: '',
    location: '',
    address: '',
  })

  useEffect(() => {
    loadJobs()
  }, [])

  // 🔹 Load company jobs
  const loadJobs = async () => {
    try {
      const data = await apiCall('/api/company/jobs')
      setJobs(data || [])
    } catch {
      toast.error('Failed to load jobs')
    }
  }

  // 🔹 Load applicants
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

  // 🔹 Update status
  const updateStatus = async (applicationId, status) => {
    try {
      await apiCall(
        `/api/company/applications/${applicationId}?status=${status}`,
        'PUT'
      )

      toast.success(`Applicant moved to ${status}`)
      loadApplicants(selectedJobId)
    } catch {
      toast.error('Failed to update status')
    }
  }

  // 🔥 Open interview scheduling form
  const openInterviewForm = (applicant) => {
    setInterviewTarget(applicant)
    setInterviewForm({
      interviewType: 'Technical',
      mode: 'Online',
      interviewDateTime: '',
      interviewerName: '',
      meetingLink: '',
      location: '',
      address: '',
    })
    setShowInterviewForm(true)
  }

  // 🔥 Submit interview schedule
  const submitInterview = async () => {

  // 🔥 VALIDATIONS
  if (!interviewForm.interviewDateTime) {
    toast.error('Please select date and time')
    return
  }

  if (!interviewForm.interviewerName.trim()) {
    toast.error('Please enter interviewer name')
    return
  }

  if (interviewForm.mode === 'Online' && !interviewForm.meetingLink.trim()) {
    toast.error('Please enter meeting link for online interview')
    return
  }

  if (interviewForm.mode === 'Offline' && !interviewForm.location.trim()) {
    toast.error('Please enter location for offline interview')
    return
  }

  // 🔥 CRITICAL FIX: Ensure studentId exists
  if (!interviewTarget?.studentId) {
    console.error("❌ studentId missing:", interviewTarget)
    toast.error("Candidate ID is missing ❌")
    return
  }

  setInterviewSubmitting(true)

  try {
    const user = JSON.parse(localStorage.getItem('user'))
    const selectedJob = jobs.find(j => String(j.id) === String(selectedJobId))

    console.log("✅ INTERVIEW TARGET:", interviewTarget)

    const payload = {
      candidateId: interviewTarget.studentId,   // ✅ FIXED (NO fallback)
      companyId: user?.id,
      jobId: selectedJob?.id,
      jobRole: selectedJob?.jobRole || 'N/A',
      interviewType: interviewForm.interviewType,
      mode: interviewForm.mode,
      interviewDateTime: interviewForm.interviewDateTime,
      interviewerName: interviewForm.interviewerName,
      meetingLink: interviewForm.mode === 'Online' ? interviewForm.meetingLink : null,
      location: interviewForm.mode === 'Offline' ? interviewForm.location : null,
      address: interviewForm.mode === 'Offline' ? interviewForm.address : null,
    }

    console.log("🚀 PAYLOAD:", payload)

    // 🔥 API CALL
    await apiCall('/api/interviews/schedule', 'POST', payload)

    // 🔥 UPDATE STATUS
    await apiCall(
      `/api/company/applications/${interviewTarget.id}?status=INTERVIEW`,
      'PUT'
    )

    toast.success('Interview scheduled successfully!')

    setShowInterviewForm(false)
    setShowProfile(false)
    loadApplicants(selectedJobId)

  } catch (err) {
    console.error("❌ ERROR:", err)
    toast.error(err.message || 'Failed to schedule interview')
  } finally {
    setInterviewSubmitting(false)
  }
}

  // 🔹 Status indicators
  const statusConfig = {
    APPLIED: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    SHORTLISTED: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: CheckCircle },
    INTERVIEW: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Users },
    SELECTED: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    REJECTED: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* 🔥 JOB SELECTOR SECTION */}
      <div className="glass p-6 rounded-3xl border border-white/40 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
          Select Active Job Role
        </label>
        <div className="relative group">
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value)
              loadApplicants(e.target.value)
            }}
            className="w-full appearance-none bg-white/50 backdrop-blur-sm border-2 border-slate-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/30 focus:bg-white transition-all duration-300 text-slate-800 font-semibold shadow-inner"
          >
            <option value="">Choose a job to view applicants...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.jobRole} — {job.location}
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:rotate-90 transition-transform">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 🔥 CONTENT AREA */}
      {!selectedJobId ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 opacity-60">
          <Users className="w-16 h-16 mb-4 stroke-[1px]" />
          <p className="font-semibold tracking-wide">Select a job post above to see interested candidates</p>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : applicants.length === 0 ? (
        <Card className="p-12 text-center glass rounded-3xl border-dashed">
          <Users className="mx-auto w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No candidates have applied for this position yet.</p>
        </Card>
      ) : (
        <div className="glass overflow-hidden rounded-3xl border border-white/50 shadow-xl shadow-indigo-100/30">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Education/Skills</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applicants.map((app) => {
                  const StatusIcon = statusConfig[app.status]?.icon || Clock
                  return (
                    <tr key={app.id} className="hover:bg-white/40 transition-colors duration-200">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-200">
                            {app.studentName?.charAt(0) || app.studentEmail?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{app.studentName || 'Anonymous'}</span>
                            <span className="text-xs text-slate-400 font-medium">{app.studentEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-700">{app.branch || 'N/A'}</span>
                          <div className="flex gap-1 flex-wrap">
                            {app.skills?.split(',').slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-semibold">
                        <Badge className={`${statusConfig[app.status]?.color} border py-1.5 px-3 rounded-xl flex items-center gap-1.5 w-fit shadow-sm`}>
                          <StatusIcon className="w-3 h-3" />
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl border-slate-200 hover:bg-white font-bold text-xs"
                            onClick={() => {
                              setSelectedStudent(app)
                              setShowProfile(true)
                            }}
                          >
                            View Profile
                          </Button>
                          
                          <div className="h-8 w-px bg-slate-100 mx-1" />

                          {app.status === 'APPLIED' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-4 font-bold shadow-md shadow-indigo-200"
                                onClick={() => updateStatus(app.id, 'SHORTLISTED')}
                              >
                                Shortlist
                              </Button>
                            </div>
                          )}
                          {app.status === 'SHORTLISTED' && (
                            <Button
                              size="sm"
                              className="bg-purple-600 text-white hover:bg-purple-700 rounded-xl px-4 font-bold shadow-md shadow-purple-200"
                              onClick={() => openInterviewForm(app)}
                            >
                              Interview
                            </Button>
                          )}
                          {app.status === 'INTERVIEW' && (
                            <Button
                              size="sm"
                              className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl px-4 font-bold shadow-md shadow-emerald-200"
                              onClick={() => updateStatus(app.id, 'SELECTED')}
                            >
                              Select
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 🔥 DETAILS MODAL */}
      {showProfile && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <Card className="p-0 overflow-hidden w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-white animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="gradient-bg p-8 pt-10 text-white relative">
              <div className="flex justify-between items-start">
                <div className="flex gap-5 items-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-bold border border-white/30 shadow-2xl">
                    {selectedStudent.studentName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{selectedStudent.studentName}</h2>
                    <p className="opacity-80 font-bold uppercase tracking-widest text-[10px] mt-1">Candidate Profile Details</p>
                  </div>
                </div>
                <Badge className={`${statusConfig[selectedStudent.status]?.color} border-none font-black px-4 py-2 rounded-2xl shadow-xl`}>
                  {selectedStudent.status}
                </Badge>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-slate-800">{selectedStudent.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Branch</p>
                    <p className="font-bold text-slate-800">{selectedStudent.branch || 'Information Technology'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Academic Score</p>
                    <p className="font-bold text-primary flex items-center gap-1.5">
                      <span className="text-2xl font-black">{selectedStudent.cgpa || '8.5'}</span>
                      <span className="text-xs font-bold text-slate-400">CGPA</span>
                    </p>
                  </div>
                  {selectedStudent.resumePath && (
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attachments</p>
                      <a
                        href={`http://localhost:8082${selectedStudent.resumePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold decoration-2 underline-offset-4"
                      >
                        <FileText className="w-5 h-5 text-indigo-500" />
                        <span>Download Resume</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Core Skills & Expertises</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedStudent.skills || 'Java, Spring Boot, React, MySQL').split(',').map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-2xl text-xs font-black border border-slate-100 shadow-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-6 border-t border-slate-50 flex flex-wrap justify-between items-center">
                <div className="flex gap-3">
                  {selectedStudent.status === 'APPLIED' && (
                    <>
                      <Button
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-6 font-bold shadow-lg shadow-indigo-100 h-12"
                        onClick={() => {
                          updateStatus(selectedStudent.id, 'SHORTLISTED')
                          setShowProfile(false)
                        }}
                      >
                        Shortlist Candidate
                      </Button>
                      <Button
                        variant="outline"
                        className="text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200 rounded-2xl px-6 font-bold h-12"
                        onClick={() => {
                          updateStatus(selectedStudent.id, 'REJECTED')
                          setShowProfile(false)
                        }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedStudent.status === 'SHORTLISTED' && (
                    <Button
                      className="bg-purple-600 text-white hover:bg-purple-700 rounded-2xl px-6 font-bold shadow-lg shadow-purple-100 h-12"
                      onClick={() => {
                        setShowProfile(false)
                        openInterviewForm(selectedStudent)
                      }}
                    >
                      Invite to Interview
                    </Button>
                  )}
                  {selectedStudent.status === 'INTERVIEW' && (
                    <Button
                      className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl px-6 font-bold shadow-lg shadow-emerald-100 h-12"
                      onClick={() => {
                        updateStatus(selectedStudent.id, 'SELECTED')
                        setShowProfile(false)
                      }}
                    >
                      Process Offer (Select)
                    </Button>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowProfile(false)}
                  className="font-bold text-slate-400 hover:text-slate-600 rounded-2xl"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 🔥 INTERVIEW SCHEDULING MODAL */}
      {showInterviewForm && interviewTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-[120] p-4">
          <Card className="p-0 overflow-hidden w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl border border-white animate-in zoom-in-95 duration-300">

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-7 text-white relative">
              <button 
                onClick={() => setShowInterviewForm(false)} 
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Schedule Interview</h2>
                  <p className="opacity-80 text-sm font-semibold mt-0.5">
                    {interviewTarget.studentName || interviewTarget.studentEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-7 space-y-5 max-h-[60vh] overflow-y-auto">

              {/* Interview Type */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Interview Type
                </label>
                <select
                  value={interviewForm.interviewType}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewType: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:border-purple-300 transition-colors bg-slate-50/50"
                >
                  <option value="Technical">Technical Round</option>
                  <option value="HR">HR Round</option>
                  <option value="Final">Final Round</option>
                  <option value="Coding">Coding Assessment</option>
                </select>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Interview Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInterviewForm({...interviewForm, mode: 'Online'})}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all duration-200 ${
                      interviewForm.mode === 'Online'
                        ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-lg shadow-purple-100'
                        : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterviewForm({...interviewForm, mode: 'Offline'})}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all duration-200 ${
                      interviewForm.mode === 'Offline'
                        ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-lg shadow-purple-100'
                        : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    Offline
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interviewForm.interviewDateTime}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewDateTime: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:border-purple-300 transition-colors bg-slate-50/50"
                />
              </div>

              {/* Interviewer Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Interviewer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter interviewer name..."
                  value={interviewForm.interviewerName}
                  onChange={(e) => setInterviewForm({...interviewForm, interviewerName: e.target.value})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:border-purple-300 transition-colors bg-slate-50/50 placeholder:text-slate-300"
                />
              </div>

              {/* Conditional: Online → Meeting Link */}
              {interviewForm.mode === 'Online' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xyz or zoom link..."
                    value={interviewForm.meetingLink}
                    onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                    className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:border-purple-300 transition-colors bg-slate-50/50 placeholder:text-slate-300"
                  />
                </div>
              )}

              {/* Conditional: Offline → Location + Address */}
              {interviewForm.mode === 'Offline' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Venue / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Conference Room B, TCS Office"
                      value={interviewForm.location}
                      onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                      className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:border-purple-300 transition-colors bg-slate-50/50 placeholder:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Full Address
                    </label>
                    <textarea
                      placeholder="Complete address with city, pin code..."
                      value={interviewForm.address}
                      onChange={(e) => setInterviewForm({...interviewForm, address: e.target.value})}
                      rows={2}
                      className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:border-purple-300 transition-colors bg-slate-50/50 placeholder:text-slate-300 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-7 pb-7 pt-2 flex gap-3">
              <Button
                onClick={submitInterview}
                disabled={interviewSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-2xl h-13 font-black text-sm shadow-xl shadow-purple-200 disabled:opacity-50"
              >
                {interviewSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scheduling...
                  </span>
                ) : (
                  'Schedule Interview'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInterviewForm(false)}
                className="rounded-2xl px-6 font-bold text-slate-400 border-slate-100 hover:text-slate-600"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}