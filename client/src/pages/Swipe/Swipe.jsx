import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import SwipeCard from './SwipeCard'
import SwipeButtons from './SwipeButtons'

const BASE = 'http://localhost:5000/api'

const Swipe = () => {
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [swiping, setSwiping] = useState(false)

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await axios.get(`${BASE}/matches/queue`, { withCredentials: true })
        const users = await Promise.all(
          res.data.queue.map(async (u) => {
            const skills = await axios.get(`${BASE}/skills/me`, {
              withCredentials: true,
              params: { user_id: u.id },
            })
            const userSkills = await axios.get(`${BASE}/profile/${u.id}`, { withCredentials: true })
            const allSkills = userSkills.data.profile.skills || []
            return {
              ...u,
              offers: allSkills.filter(s => s.type === 'offers').map(s => s.name),
              wants: allSkills.filter(s => s.type === 'wants').map(s => s.name),
            }
          })
        )
        setQueue(users)
      } catch (err) {
        toast.error('Failed to load swipe queue')
      } finally {
        setLoading(false)
      }
    }
    fetchQueue()
  }, [])

  const handleSwipe = async (direction) => {
    if (swiping || current >= queue.length) return
    setSwiping(true)
    try {
      const res = await axios.post(
        `${BASE}/matches/swipe`,
        { swiped_id: queue[current].id, direction },
        { withCredentials: true }
      )
      if (res.data.matched) {
        toast.success(`🎉 It's a match with ${queue[current].name}!`)
      }
      setCurrent((prev) => prev + 1)
    } catch (err) {
      toast.error('Swipe failed')
    } finally {
      setSwiping(false)
    }
  }

  if (loading) return <div className="loading">Loading matches...</div>

  if (current >= queue.length) {
    return (
      <div className="swipe-empty">
        <h2>🎉 You're all caught up!</h2>
        <p>No more profiles to swipe. Check back later.</p>
      </div>
    )
  }

  return (
    <div className="swipe-container">
      <SwipeCard user={queue[current]} />
      <SwipeButtons
        onLeft={() => handleSwipe('left')}
        onRight={() => handleSwipe('right')}
        disabled={swiping}
      />
    </div>
  )
}

export default Swipe