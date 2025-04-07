import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)

const BASE = 'http://localhost:5000/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE}/profile/me`, { withCredentials: true })
        setUser(res.data.profile)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const login = async (email, password) => {
    const res = await axios.post(`${BASE}/auth/login`, { email, password }, { withCredentials: true })
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await axios.post(`${BASE}/auth/register`, { name, email, password }, { withCredentials: true })
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    await axios.post(`${BASE}/auth/logout`, {}, { withCredentials: true })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}