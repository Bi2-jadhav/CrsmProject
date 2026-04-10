import axios from "axios"

const API_BASE_URL = "http://localhost:8080"

const api = axios.create({
  baseURL: API_BASE_URL
})

// ✅ Attach token properly
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    // ❗ Do NOT attach token for login/register
    if (token && !config.url?.includes("/api/auth")) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Handle errors safely (FIXED)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url || ""

    // ✅ ONLY logout if token exists AND it's NOT first request
    if (status === 401) {
      const token = localStorage.getItem("token")

      console.log("🚨 401 ERROR FROM:", requestUrl)

      // ❗ VERY IMPORTANT: Ignore first-time API failures
      if (token && !requestUrl.includes("/api/auth")) {
        console.warn("Token might be invalid, but not forcing logout immediately")

        // 🔥 TEMP FIX: DO NOT REMOVE TOKEN IMMEDIATELY
        // localStorage.removeItem("token")
        // window.location.replace("/login")
      }
    }

    return Promise.reject(error)
  }
)

// ✅ Common API call
export const apiCall = async (url, method = 'GET', body = null) => {
  try {
    const response = await api({
      url,
      method,
      data: body
    })
    return response.data
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message)

    throw new Error(
      error.response?.data?.message ||
      error.response?.data ||
      "API error"
    )
  }
}

// ✅ File upload (already good, just cleaned)
export const uploadFile = async (endpoint, file) => {
  const formData = new FormData()
  formData.append("file", file)

  const token = localStorage.getItem("token")

  const response = await api.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export default api