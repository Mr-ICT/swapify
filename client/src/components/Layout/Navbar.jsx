import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

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
      <Link to="/" className="navbar-brand">
        <div className="brand-icon">
          <i className="ti ti-arrows-exchange" aria-hidden="true" />
        </div>
        Swapify
      </Link>

      {user && (
        <div className="navbar-links">
          <Link to="/swipe" className={`nav-link ${pathname === '/swipe' ? 'active' : ''}`}>
            <i className="ti ti-cards" aria-hidden="true" />
            Swipe
          </Link>
          <Link to="/matches" className={`nav-link ${pathname === '/matches' ? 'active' : ''}`}>
            <i className="ti ti-users" aria-hidden="true" />
            Matches
          </Link>
          <Link to="/profile" className={`nav-link ${pathname === '/profile' ? 'active' : ''}`}>
            <i className="ti ti-user-circle" aria-hidden="true" />
            Profile
          </Link>
        </div>
      )}

      {user ? (
        <button className="nav-logout" onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true" />
          Log out
        </button>
      ) : (
        <div className="navbar-links">
          <Link to="/login" className={`nav-link ${pathname === '/login' ? 'active' : ''}`}>
            Log in
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ marginTop: 0, width: 'auto', padding: '6px 14px' }}>
            Sign up
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar