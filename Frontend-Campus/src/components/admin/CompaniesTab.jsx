

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Trash2 } from 'lucide-react'

export default function CompaniesTab() {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setIsLoading(true)
    try {
      const data = await apiCall('/api/internal/companies', 'GET', null, token)
      setCompanies(data || [])
    } catch (error) {
      toast.error('Failed to load companies')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (companyId) => {
    try {
      await apiCall(`/api/internal/companies/${companyId}`, 'PUT', { verified: true }, token)
      toast.success('Company verified!')
      fetchCompanies()
    } catch (error) {
      toast.error('Failed to verify company')
    }
  }

  const handleReject = async (companyId) => {
    try {
      await apiCall(`/api/internal/companies/${companyId}`, 'PUT', { verified: false }, token)
      toast.success('Company rejected!')
      fetchCompanies()
    } catch (error) {
      toast.error('Failed to reject company')
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return

    try {
      await apiCall(`/api/internal/companies/${companyId}`, 'DELETE', null, token)
      toast.success('Company deleted!')
      fetchCompanies()
    } catch (error) {
      toast.error('Failed to delete company')
    }
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading companies...</p>
        </Card>
      ) : companies.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No companies found</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={company.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {company.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {!company.verified && (
                      <>
                        <Button
                          onClick={() => handleVerify(company.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                        <Button
                          onClick={() => handleReject(company.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => handleDeleteCompany(company.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
