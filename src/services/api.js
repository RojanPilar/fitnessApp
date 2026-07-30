import axios from 'axios'

// ─── Base Axios Instance ──────────────────────────────────────────────────────
const api = axios.create({
  // Dynamically reads from your .env file instead of hardcoding the URL
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})


// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs BEFORE every request leaves the browser.
// If a token exists in localStorage, it gets attached automatically.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api