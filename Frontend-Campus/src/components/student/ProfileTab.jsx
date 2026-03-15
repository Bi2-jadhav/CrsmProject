import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../context/AuthContext'
import { apiCall, uploadFile } from '@/lib/api'
import { toast } from 'sonner'
import { Upload, User, Mail, Phone, BookOpen, Award, Calendar, Edit, X, Check, FileText } from 'lucide-react'

export default function ProfileTab() {
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

  // Fetch profile on mount
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
    } catch (error) {
      // Profile doesn't exist yet, that's okay
      console.log('No profile found, user can create one')
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
    // Validation
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
    } catch (error) {
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
      // Refresh profile to get updated resume path
      await fetchProfile()
    } catch (error) {
      toast.error('Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Other'
  ]

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Loading profile...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* PROFILE INFORMATION */}
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Profile Information
          </h2>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* EMAIL (READ-ONLY) */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.email || '-'}
              </p>
            </div>
          </div>

          {/* NAME */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Name</p>
              {isEditing ? (
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile.name || '-'}
                </p>
              )}
            </div>
          </div>

          {/* PHONE */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Phone</p>
              {isEditing ? (
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile.phone || '-'}
                </p>
              )}
            </div>
          </div>

          {/* BRANCH */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Branch</p>
              {isEditing ? (
                <select
                  value={formData.branch || ''}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile.branch || '-'}
                </p>
              )}
            </div>
          </div>

          {/* SKILLS */}
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-pink-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Skills</p>
              {isEditing ? (
                <Input
                  value={formData.skills || ''}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., Java, React, Spring Boot"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile.skills || '-'}
                </p>
              )}
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Comma-separated values</p>
              )}
            </div>
          </div>

          {/* CGPA */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">CGPA</p>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa || ''}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                  placeholder="e.g., 8.5"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile.cgpa || '-'}
                </p>
              )}
            </div>
          </div>

          {/* GRADUATION YEAR */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Graduation Year</p>
              {isEditing ? (
                <Input
                  type="number"
                  min="2020"
                  max="2030"
                  value={formData.graduationYear || ''}
                  onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                  placeholder="e.g., 2024"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">
                  {profile.graduationYear || '-'}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* RESUME SECTION */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Resume</h2>

        {profile.resumePath ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-8 h-8 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-green-900">Resume Uploaded</p>
                <p className="text-sm text-green-700">{profile.resumePath.split('/').pop()}</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Upload a new resume to replace the current one</p>

              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                disabled={isUploading}
                className="hidden"
                id="resume-upload"
              />

              <Button
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? 'Uploading...' : 'Replace Resume'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload your resume (PDF format)</p>

            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              disabled={isUploading}
              className="hidden"
              id="resume-upload"
            />

            <Button
              onClick={() => document.getElementById('resume-upload')?.click()}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
