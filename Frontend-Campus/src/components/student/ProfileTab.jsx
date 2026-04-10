import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../context/AuthContext'
import { apiCall, uploadFile } from '@/lib/api'
import { toast } from 'sonner'
import {
  Upload, User, Mail, Phone, BookOpen,
  Award, Calendar, Edit, X, Check, FileText
} from 'lucide-react'

export default function ProfileTab() {

  const FILE_BASE_URL = "http://localhost:8082" // ✅ important

  const auth = useAuth()
  const user = auth?.user
  const token = auth?.token

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    branch: '',
    skills: '',
    cgpa: '',
    graduationYear: '',
    resumePath: ''
  })

  const [formData, setFormData] = useState({ ...profile })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const data = await apiCall('/api/student/profile')
      if (data) {
        setProfile(data)
        setFormData(data)
      }
    } catch {
      console.log('No profile found')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setFormData({ ...profile })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({ ...profile })
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Name is required')
      return
    }

    if (formData.cgpa && (formData.cgpa < 0 || formData.cgpa > 10)) {
      toast.error('CGPA must be between 0 and 10')
      return
    }

    setIsSaving(true)
    try {
      const savedProfile = await apiCall('/api/student/profile', 'POST', formData)
      setProfile(savedProfile)
      setFormData(savedProfile)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!token) {
      toast.error('Unauthorized')
      return
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file')
      return
    }

    setIsUploading(true)
    try {
      await uploadFile('/api/student/resume', file)
      toast.success('Resume uploaded successfully!')
      await fetchProfile()
    } catch {
      toast.error('Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const branches = [
    'Computer Science', 'Information Technology',
    'Electronics & Communication', 'Electrical Engineering',
    'Mechanical Engineering', 'Civil Engineering',
    'Chemical Engineering', 'Other'
  ]

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p>Loading profile...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">

      {/* PROFILE */}
      <Card className="p-8">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Profile Information</h2>

          {!isEditing ? (
            <Button onClick={handleEdit} className="bg-blue-600 text-white">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} className="bg-gray-500 text-white">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 text-white">
                <Check className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <p><b>Email:</b> {user?.email}</p>

        {/* NAME */}
        <p><b>Name:</b> {isEditing ? (
          <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}/>
        ) : profile.name}</p>

        {/* BRANCH */}
        <p><b>Branch:</b> {isEditing ? (
          <select value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
            {branches.map(b => <option key={b}>{b}</option>)}
          </select>
        ) : profile.branch}</p>

        {/* SKILLS */}
        <p><b>Skills:</b> {isEditing ? (
          <Input value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})}/>
        ) : profile.skills}</p>

        {/* CGPA */}
        <p><b>CGPA:</b> {isEditing ? (
          <Input type="number" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})}/>
        ) : profile.cgpa}</p>

        {/* YEAR */}
        <p><b>Graduation Year:</b> {isEditing ? (
          <Input type="number" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: e.target.value})}/>
        ) : profile.graduationYear}</p>

      </Card>

      {/* RESUME */}
      <Card className="p-8">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>

        {profile.resumePath ? (

          <div className="space-y-4">

            {/* ✅ UPDATED VIEW BLOCK */}
            <div className="flex justify-between items-center p-4 bg-green-50 border rounded">

              <div>
                <p className="font-semibold text-green-900">Resume Uploaded</p>
                <p className="text-sm text-green-700">
                  {profile.resumePath.split('/').pop()}
                </p>
              </div>

              <a
                href={`${FILE_BASE_URL}${profile.resumePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>

            </div>

            {/* Replace Resume */}
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />

            <Button
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white"
            >
              {isUploading ? 'Uploading...' : 'Replace Resume'}
            </Button>

          </div>

        ) : (

          <div className="text-center">

            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
            />

            <Button
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={isUploading}
              className="bg-blue-600 text-white"
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Button>

          </div>

        )}
      </Card>

    </div>
  )
}