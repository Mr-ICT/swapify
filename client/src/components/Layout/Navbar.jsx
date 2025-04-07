import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out')
      navigate('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🔄 Swapify</Link>
      {user ? (
        <div className="navbar-links">
          <Link to="/swipe">Swipe</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar