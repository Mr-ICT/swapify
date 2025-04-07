import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes('/auth/')
    ) {
      original._retry = true
      try {
        await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true })
        return api(original)
      } catch {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api