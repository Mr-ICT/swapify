import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import Navbar from './components/Layout/Navbar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Profile from './pages/Profile/Profile'
import Swipe from './pages/Swipe/Swipe'
import Matches from './pages/Matches/Matches'
import Deals from './pages/Deals/Deals'
import DealRoom from './pages/Deals/DealRoom'
import Search from './pages/Search/Search'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/swipe" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
<Route path="/deals/:id" element={<ProtectedRoute><DealRoom /></ProtectedRoute>} />
<Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route
          path="/swipe"
          element={
            <ProtectedRoute>
              <Swipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App