import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token and handle method spoofing for cPanel
api.interceptors.request.use(
  (config) => {
    // Method spoofing to bypass strict cPanel security blocking PUT/DELETE
    const method = config.method?.toLowerCase();
    if (['put', 'patch', 'delete'].includes(method)) {
      config.headers['X-HTTP-Method-Override'] = method.toUpperCase();
      const separator = config.url.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}_method=${method.toUpperCase()}`;
      config.method = 'post';
    }

    const token = localStorage.getItem('simbk_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('simbk_token')
      localStorage.removeItem('simbk_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
