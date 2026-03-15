import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/ui/Card'
import { Users, Briefcase, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated, user, authReady } = useAuth()
  const navigate = useNavigate()

  // Redirect only if user is already logged in
  // COMMENTED OUT: Removed automatic redirect to allow users to view homepage
  // React.useEffect(() => {
  //   if (!authReady) return

  //   if (isAuthenticated) {
  //     if (user?.role === 'STUDENT') navigate('/dashboard/student')
  //     else if (user?.role === 'COMPANY') navigate('/dashboard/company')
  //     else if (user?.role === 'ADMIN') navigate('/dashboard/admin')
  //   }
  // }, [authReady, isAuthenticated, user, navigate])

  if (!authReady) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">RP</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Recruitment Portal
              </span>
            </div>

            {/* AUTH BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Talent with Opportunity
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern recruitment platform designed to streamline the hiring
            process for students, companies, and administrators.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              Sign Up
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="For Students"
            points={[
              'Browse available jobs',
              'Upload resume',
              'Track applications',
            ]}
          />

          <FeatureCard
            icon={<Briefcase className="w-6 h-6 text-green-600" />}
            title="For Companies"
            points={[
              'Post job listings',
              'Manage applicants',
              'Accept / Reject applications',
            ]}
          />

          <FeatureCard
            icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
            title="For Admins"
            points={[
              'User management',
              'Company verification',
              'Platform analytics',
            ]}
          />
        </div>

        {/* CTA */}
        <Card className="p-12 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of users on our recruitment platform
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              Sign Up
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border border-white text-white hover:bg-white hover:text-blue-600 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </Card>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Recruitment Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

/* ---------------- Helper Component ---------------- */

function FeatureCard({ icon, title, points }) {
  return (
    <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
      <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        {points.map((p) => (
          <li key={p} className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
