import axios from "axios"

const API_BASE_URL = "http://localhost:8080"

const api = axios.create({
baseURL: API_BASE_URL,
withCredentials: false, // 🔥 important for microservices
})

// ✅ REQUEST INTERCEPTOR (Attach token safely)
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem("token")


// ❗ Skip auth endpoints
if (token && !config.url?.includes("/api/auth")) {
  config.headers.Authorization = `Bearer ${token}`
}

// 🔥 Debug (very useful)
console.log("➡️ API Request:", config.method?.toUpperCase(), config.url)

return config


},
(error) => Promise.reject(error)
)

// ✅ RESPONSE INTERCEPTOR (Better handling)
api.interceptors.response.use(
(response) => {
console.log("✅ API Response:", response.config.url)
return response
},
(error) => {
const status = error.response?.status
const requestUrl = error.config?.url || ""


console.error("❌ API ERROR:", status, requestUrl)

// 🔥 Handle unauthorized
if (status === 401) {
  const token = localStorage.getItem("token")

  // Avoid logout loops
  if (token && !requestUrl.includes("/api/auth")) {
    console.warn("⚠️ Token expired or invalid")

    // OPTIONAL (enable later)
    // localStorage.removeItem("token")
    // localStorage.removeItem("user")
    // window.location.replace("/login")
  }
}

// 🔥 Handle forbidden (your 403 case)
if (status === 403) {
  console.warn("⛔ Access forbidden:", requestUrl)
}

return Promise.reject(error)

}
)

// ✅ COMMON API CALL
export const apiCall = async (url, method = "GET", body = null) => {
try {
const response = await api({
url,
method,
data: body,
})


return response.data


} catch (error) {
const message =
error.response?.data?.message ||
error.response?.data ||
error.message ||
"API error"


console.error("🚨 API CALL FAILED:", message)

throw new Error(message)


}
}

// ✅ FILE UPLOAD
export const uploadFile = async (endpoint, file) => {
const formData = new FormData()
formData.append("file", file)

try {
const response = await api.post(endpoint, formData, {
headers: {
"Content-Type": "multipart/form-data",
},
})


return response.data


} catch (error) {
console.error("🚨 File upload failed:", error)
throw error
}
}

export default api
