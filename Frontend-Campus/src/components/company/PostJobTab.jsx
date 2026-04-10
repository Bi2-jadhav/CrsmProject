import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '../../context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { Briefcase, MapPin, DollarSign, Users, Zap, Code } from 'lucide-react'

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

  const fields = [
    { name: 'companyName', label: 'Company Name', placeholder: 'e.g. Infosys, Google', icon: Briefcase, required: true },
    { name: 'jobRole', label: 'Job Role', placeholder: 'e.g. Software Engineer', icon: Briefcase, required: true },
    { name: 'location', label: 'Location', placeholder: 'e.g. Bangalore, Remote', icon: MapPin, required: true },
    { name: 'ctc', label: 'CTC (Annual Salary)', placeholder: 'e.g. 600000', icon: DollarSign, type: 'number', required: true },
    { name: 'eligibility', label: 'Eligibility Criteria', placeholder: 'e.g. CGPA ≥ 7.0', icon: Users, required: true },
    { name: 'rounds', label: 'Number of Rounds', placeholder: 'e.g. 3', icon: Zap, type: 'number', required: true },
    { name: 'skills', label: 'Required Skills', placeholder: 'e.g. Java, React, SQL (comma separated)', icon: Code, required: true },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 border-0 shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">Fill in the details to post a new job opening</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.name} className={field.name === 'skills' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-600" />
                    {field.label}
                  </label>
                  <Input
                    name={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full"
                  />
                </div>
              )
            })}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-lg transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting Job...
                </div>
              ) : (
                'Post Job'
              )}
            </Button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Tip:</span> Provide accurate job details to attract qualified candidates. Make sure to list all required skills and be clear about eligibility criteria.
          </p>
        </div>
      </Card>
    </div>
  )
}
