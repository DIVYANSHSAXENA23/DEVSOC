import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { getBackendBase } from '../api'
import './FormComponents.css'

const FALLBACK_STATES = [
  'Andhra Pradesh', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra',
  'Odisha', 'Tamil Nadu', 'West Bengal',
]

export default function StateSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [states, setStates] = useState(FALLBACK_STATES)
  const [filtered, setFiltered] = useState(states)
  const [searchTerm, setSearchTerm] = useState(value)
  const containerRef = useRef(null)

  useEffect(() => {
    const url = getBackendBase()
    axios.get(`${url}/states`, { timeout: 8000 })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.states) && res.data.states.length > 0) {
          setStates(res.data.states)
          setFiltered(res.data.states)
        }
      })
      .catch(() => { /* keep fallback */ })
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const results = states.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFiltered(results)
    } else {
      setFiltered(states)
    }
  }, [searchTerm, states])

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

  const handleSelect = (state) => {
    onChange(state)
    setSearchTerm(state)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  return (
    <div className="form-group autocomplete-container" ref={containerRef}>
      <label htmlFor="state">Select State/Region</label>
      <div className="autocomplete-wrapper">
        <input
          id="state"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search state..."
          className="form-input autocomplete-input"
          autoComplete="off"
        />
        {isOpen && filtered.length > 0 && (
          <div className="autocomplete-dropdown">
            {filtered.map((state) => (
              <div
                key={state}
                className={`autocomplete-item ${state === value ? 'selected' : ''}`}
                onClick={() => handleSelect(state)}
              >
                {state}
              </div>
            ))}
          </div>
        )}
        {isOpen && searchTerm && filtered.length === 0 && (
          <div className="autocomplete-dropdown">
            <div className="autocomplete-item no-results">No states found</div>
          </div>
        )}
      </div>
    </div>
  )
}
