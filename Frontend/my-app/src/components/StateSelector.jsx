import { useState, useRef, useEffect } from 'react'
import './FormComponents.css'

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export default function StateSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState(STATES)
  const [searchTerm, setSearchTerm] = useState(value)
  const containerRef = useRef(null)

  useEffect(() => {
    if (searchTerm) {
      const results = STATES.filter((state) =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFiltered(results)
    } else {
      setFiltered(STATES)
    }
  }, [searchTerm])

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
