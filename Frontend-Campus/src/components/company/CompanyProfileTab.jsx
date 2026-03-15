import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'

export default function CompanyProfileTab() {
  const [profile, setProfile] = useState({
    companyName: '',
    description: '',
    location: '',
    website: '',
    blocked: false,
  })

  const [loading, setLoading] = useState(false)

  // Load existing profile (if any)
  useEffect(() => {
    apiCall('/api/company/profile')
      .then(data => {
        if (data) setProfile(data)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await apiCall('/api/company/profile', 'POST', profile)
      toast.success('Company profile created successfully')
    } catch {
      toast.error('Failed to save company profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-3xl space-y-4">
      <h2 className="text-2xl font-bold">Create Company Profile</h2>

      <Input
        placeholder="Company Name"
        value={profile.companyName}
        onChange={e => setProfile({ ...profile, companyName: e.target.value })}
      />

      <textarea
        placeholder="Company Description"
        value={profile.description}
        onChange={e => setProfile({ ...profile, description: e.target.value })}
        className="w-full border rounded-lg p-3"
      />

      <Input
        placeholder="Location"
        value={profile.location}
        onChange={e => setProfile({ ...profile, location: e.target.value })}
      />

      <Input
        placeholder="Website"
        value={profile.website}
        onChange={e => setProfile({ ...profile, website: e.target.value })}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white"
      >
        {loading ? 'Saving...' : 'Create / Update Profile'}
      </Button>
    </Card>
  )
}
