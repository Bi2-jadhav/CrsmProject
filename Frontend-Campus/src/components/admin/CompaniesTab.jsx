

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { apiCall } from '@/lib/api'
import { toast } from 'sonner'
import { ShieldOff, ShieldCheck, Trash2 } from 'lucide-react'

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
      const data = await apiCall('/api/admin/companies', 'GET', null)
      setCompanies(data || [])
    } catch (error) {
      toast.error('Failed to load companies')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlock = async (companyId) => {
    try {
      await apiCall(`/api/admin/companies/block/${companyId}`, 'PUT', null)
      toast.success('Company blocked!')
      fetchCompanies()
    } catch (error) {
      toast.error('Failed to block company')
    }
  }

  const handleUnblock = async (companyId) => {
    try {
      await apiCall(`/api/admin/companies/unblock/${companyId}`, 'PUT', null)
      toast.success('Company unblocked!')
      fetchCompanies()
    } catch (error) {
      toast.error('Failed to unblock company')
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return

    try {
      await apiCall(`/api/admin/companies/${companyId}`, 'DELETE', null)
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
                  Location
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
                    {company.companyName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.location || '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge className={company.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {company.blocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {company.blocked ? (
                      <Button
                        onClick={() => handleUnblock(company.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <ShieldCheck className="w-4 h-4 mr-1" />
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleBlock(company.id)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <ShieldOff className="w-4 h-4 mr-1" />
                        Block
                      </Button>
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
