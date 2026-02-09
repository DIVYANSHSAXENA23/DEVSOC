import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { getBackendBase } from '../api'
import './FormComponents.css'

// Fallback from CSV so rivers show even when backend is not running
const STATE_RIVERS_FALLBACK = {
  'Andhra Pradesh': ['Godavari', 'Krishna', 'Penna'],
  'Gujarat': ['Mahi', 'Narmada', 'Sabarmati', 'Tapi'],
  'Karnataka': ['Kaveri', 'Krishna', 'Tungabhadra'],
  'Kerala': ['Bharathapuzha', 'Chaliyar', 'Pamba', 'Periyar'],
  'Maharashtra': ['Godavari', 'Krishna', 'Tapi', 'Wardha'],
  'Odisha': ['Baitarani', 'Brahmani', 'Mahanadi'],
  'Tamil Nadu': ['Kaveri', 'Palar', 'Vaigai'],
  'West Bengal': ['Damodar', 'Hooghly', 'Subarnarekha', 'Teesta'],
}

export default function RiverSelector({ value, onChange, state: selectedState }) {
  const [isOpen, setIsOpen] = useState(false)
  const [rivers, setRivers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState(value)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!selectedState) {
      setRivers([])
      setFiltered([])
      return
    }
    setLoading(true)
    const url = getBackendBase()
    axios.get(`${url}/rivers`, { params: { state: selectedState }, timeout: 8000 })
      .then((res) => {
        const list = res.data?.rivers ?? []
        setRivers(list.length > 0 ? list : (STATE_RIVERS_FALLBACK[selectedState] || []))
        setFiltered(list.length > 0 ? list : (STATE_RIVERS_FALLBACK[selectedState] || []))
      })
      .catch(() => {
        const fallback = STATE_RIVERS_FALLBACK[selectedState] || []
        setRivers(fallback)
        setFiltered(fallback)
      })
      .finally(() => setLoading(false))
  }, [selectedState])

  useEffect(() => {
    if (searchTerm && rivers.length) {
      const results = rivers.filter((r) =>
        r.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFiltered(results)
    } else {
      setFiltered(rivers)
    }
  }, [searchTerm, rivers])

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (riverName) => {
    onChange(riverName)
    setSearchTerm(riverName)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  return (
    <div className="form-group autocomplete-container" ref={containerRef}>
      <label htmlFor="river">Select River/Estuary</label>
      <div className="autocomplete-wrapper">
        <input
          id="river"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => selectedState && setIsOpen(true)}
          placeholder={selectedState ? 'Search river...' : 'Select state first'}
          className="form-input autocomplete-input"
          autoComplete="off"
          disabled={!selectedState || loading}
        />
        {loading && <span className="autocomplete-loading">Loading rivers...</span>}
        {isOpen && filtered.length > 0 && (
          <div className="autocomplete-dropdown">
            {filtered.map((riverName, idx) => (
              <div
                key={idx}
                className={`autocomplete-item ${riverName === value ? 'selected' : ''}`}
                onClick={() => handleSelect(riverName)}
              >
                <div className="item-name">{riverName}</div>
              </div>
            ))}
          </div>
        )}
        {isOpen && searchTerm && filtered.length === 0 && !loading && (
          <div className="autocomplete-dropdown">
            <div className="autocomplete-item no-results">
              {rivers.length === 0 && selectedState ? 'No rivers in dataset for this state' : 'No matching rivers'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

