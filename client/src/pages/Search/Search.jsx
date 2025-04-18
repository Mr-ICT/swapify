import { useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'


const BASE = 'http://localhost:5000/api'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = useCallback(async () => {
    if (query.trim().length < 2) return toast.error('Enter at least 2 characters')
    setLoading(true)
    setSearched(true)
    try {
      const res = await axios.get(`${BASE}/search?q=${encodeURIComponent(query)}`, {
        withCredentials: true,
      })
      setResults(res.data.users || [])
    } catch {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }, [query])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="matches-page">
      <div className="matches-header">
        <div className="matches-title">Search</div>
        <div className="matches-sub">Find people by name or skill</div>
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <i
            className="ti ti-search"
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: 15,
            }}
          />
          <input
            className="form-control"
            style={{ paddingLeft: 36 }}
            placeholder="Search by name or skill e.g. React, Photography..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button className="btn-add" onClick={handleSearch} disabled={loading}>
          {loading
            ? <i className="ti ti-loader-2" aria-hidden="true" />
            : <><i className="ti ti-search" aria-hidden="true" /> Search</>
          }
        </button>
      </div>

      {/* Results */}
      {!searched && (
        <div className="state-container" style={{ minHeight: 'auto', padding: '40px 0' }}>
          <div className="state-icon">
            <i className="ti ti-search" aria-hidden="true" />
          </div>
          <div className="state-title">Search for a skill or name</div>
          <div className="state-sub">Find people whose skills match what you need</div>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="state-container" style={{ minHeight: 'auto', padding: '40px 0' }}>
          <div className="state-icon">
            <i className="ti ti-mood-empty" aria-hidden="true" />
          </div>
          <div className="state-title">No results found</div>
          <div className="state-sub">Try a different skill or name</div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {results.map(u => (
            <div key={u.id} className="sidebar-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div className="match-card-avatar" style={{ width: 44, height: 44, fontSize: 16, flexShrink: 0 }}>
                {u.avatar_url
                  ? <img src={u.avatar_url} alt={u.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : u.name?.charAt(0).toUpperCase()
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{u.name}</div>
                {u.location && (
                  <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <i className="ti ti-map-pin" style={{ fontSize: 12 }} aria-hidden="true" />
                    {u.location}
                  </div>
                )}
                {u.bio && (
                  <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 8, lineHeight: 1.5 }}>
                    {u.bio}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {u.offers?.filter(Boolean).map((s, i) => (
                    <span key={i} className="tag tag-offer">{s}</span>
                  ))}
                  {u.wants?.filter(Boolean).map((s, i) => (
                    <span key={i} className="tag tag-want">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search