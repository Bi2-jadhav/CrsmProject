import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'

export default function PostJobTab() {
  const auth = useAuth()
  const token = auth?.token

  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    location: '',
    ctc: '',
    eligibility: '',
    rounds: '',
    skills: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Unauthorized')
      return
    }

    setIsLoading(true)

    try {
      await apiCall('/api/company/jobs', 'POST', {
        companyName: formData.companyName,
        jobRole: formData.jobRole,
        location: formData.location,
        ctc: Number(formData.ctc),
        eligibility: formData.eligibility,
        rounds: Number(formData.rounds),
        skills: formData.skills,
      })

      toast.success('Job posted successfully!')

      setFormData({
        companyName: '',
        jobRole: '',
        location: '',
        ctc: '',
        eligibility: '',
        rounds: '',
        skills: '',
      })
    } catch (error) {
      toast.error('Failed to post job')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Post Job
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ✅ COMPANY NAME (EDITABLE) */}
        <Input
          name="companyName"
          placeholder="Company Name (e.g. Infosys)"
          value={formData.companyName}
          onChange={handleChange}
          required
        />

        <Input
          name="jobRole"
          placeholder="Job Role (e.g. Software Engineer)"
          value={formData.jobRole}
          onChange={handleChange}
          required
        />

        <Input
          name="location"
          placeholder="Location (e.g. Bangalore)"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <Input
          name="ctc"
          type="number"
          placeholder="CTC (e.g. 600000)"
          value={formData.ctc}
          onChange={handleChange}
          required
        />

        <Input
          name="eligibility"
          placeholder="Eligibility (e.g. CGPA ≥ 7.0)"
          value={formData.eligibility}
          onChange={handleChange}
          required
        />

        <Input
          name="rounds"
          type="number"
          placeholder="Number of Rounds"
          value={formData.rounds}
          onChange={handleChange}
          required
        />

        <Input
          name="skills"
          placeholder="Required Skills (Java, React, SQL)"
          value={formData.skills}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white"
        >
          {isLoading ? 'Posting Job...' : 'Post Job'}
        </Button>
      </form>
    </Card>
  )
}
