import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ SINGLE interceptor – attach token safely
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    // Do not attach token to auth endpoints
    if (token && !config.url?.includes('/api/auth')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ✅ API call helper
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const response = await api({
    url: endpoint,
    method,
    data,
  })
  return response.data
}

// ✅ File upload helper
export const uploadFile = async (endpoint, file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

export default api
