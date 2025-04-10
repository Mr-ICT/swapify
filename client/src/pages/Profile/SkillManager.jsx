import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const BASE = 'http://localhost:5000/api'

const SkillManager = ({ userSkills, onSkillsUpdated }) => {
  const [allSkills, setAllSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [type, setType] = useState('offers')
  const [level, setLevel] = useState('beginner')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get(`${BASE}/skills`, { withCredentials: true })
        setAllSkills(res.data.skills)
      } catch {
        toast.error('Failed to load skills')
      }
    }
    fetchSkills()
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setSkillInput(val)
    if (val.trim().length > 0) {
      const filtered = allSkills.filter(s =>
        s.name.toLowerCase().includes(val.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 6))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (name) => {
    setSkillInput(name)
    setShowSuggestions(false)
  }

  const handleAdd = async () => {
    if (!skillInput.trim()) return toast.error('Enter a skill name')
    setLoading(true)
    try {
      await axios.post(
        `${BASE}/skills/me`,
        { skill_name: skillInput.trim(), type, level },
        { withCredentials: true }
      )
      toast.success('Skill added')
      setSkillInput('')
      setSuggestions([])
      onSkillsUpdated()
    } catch {
      toast.error('Failed to add skill')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      await axios.delete(`${BASE}/skills/me/${id}`, { withCredentials: true })
      toast.success('Skill removed')
      onSkillsUpdated()
    } catch {
      toast.error('Failed to remove skill')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const offers = userSkills.filter(s => s.type === 'offers')
  const wants = userSkills.filter(s => s.type === 'wants')

  return (
    <div className="skills-card">
      <div className="skills-card-header">
        <span className="skills-card-title">Skills</span>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>
          {userSkills.length} skill{userSkills.length !== 1 ? 's' : ''} added
        </span>
      </div>

      <div className="skill-input-row">
        <div className="skill-input-wrapper">
          <input
            className="form-control"
            type="text"
            placeholder="Type a skill e.g. React, Photography..."
            value={skillInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => skillInput && setShowSuggestions(true)}
          />
          {showSuggestions && (suggestions.length > 0 || skillInput.trim()) && (
            <div className="suggestions">
              {suggestions.map(s => (
                <div
                  key={s.id}
                  className="suggestion-item"
                  onMouseDown={() => handleSuggestionClick(s.name)}
                >
                  <span>{s.name}</span>
                  <span className="suggestion-category">{s.category}</span>
                </div>
              ))}
              {!suggestions.find(s => s.name.toLowerCase() === skillInput.toLowerCase()) && skillInput.trim() && (
                <div
                  className="suggestion-item suggestion-new"
                  onMouseDown={() => handleSuggestionClick(skillInput)}
                >
                  <span>Add "{skillInput}"</span>
                  <i className="ti ti-plus" style={{ fontSize: 13 }} aria-hidden="true" />
                </div>
              )}
            </div>
          )}
        </div>

        <select
          className="select-sm"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="offers">I offer</option>
          <option value="wants">I want</option>
        </select>

        <select
          className="select-sm"
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        <button className="btn-add" onClick={handleAdd} disabled={loading}>
          <i className="ti ti-plus" aria-hidden="true" />
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>

      <div className="skills-grid">
        <div>
          <div className="skill-col-title offers">
            <i className="ti ti-briefcase" aria-hidden="true" />
            I offer
          </div>
          {offers.length === 0 && (
            <div className="skills-empty">No skills added yet</div>
          )}
          {offers.map(s => (
            <div key={s.id} className="skill-pill">
              <div>
                <div className="skill-pill-name">{s.name}</div>
                <div className="skill-pill-level">{s.level}</div>
              </div>
              <button
                className="skill-pill-remove"
                onClick={() => handleRemove(s.id)}
                aria-label={`Remove ${s.name}`}
              >
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div>
          <div className="skill-col-title wants">
            <i className="ti ti-target" aria-hidden="true" />
            I want
          </div>
          {wants.length === 0 && (
            <div className="skills-empty">No skills added yet</div>
          )}
          {wants.map(s => (
            <div key={s.id} className="skill-pill">
              <div>
                <div className="skill-pill-name">{s.name}</div>
                <div className="skill-pill-level">{s.level}</div>
              </div>
              <button
                className="skill-pill-remove"
                onClick={() => handleRemove(s.id)}
                aria-label={`Remove ${s.name}`}
              >
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SkillManager