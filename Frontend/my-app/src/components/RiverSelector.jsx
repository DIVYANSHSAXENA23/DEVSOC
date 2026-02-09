import { useState, useRef, useEffect } from 'react'
import './FormComponents.css'

const WATER_BODIES = [
  // Major Rivers
  { name: 'Ganga', type: 'River', state: 'Multiple' },
  { name: 'Yamuna', type: 'River', state: 'Multiple' },
  { name: 'Brahmaputra', type: 'River', state: 'Multiple' },
  { name: 'Godavari', type: 'River', state: 'Multiple' },
  { name: 'Krishna', type: 'River', state: 'Multiple' },
  { name: 'Narmada', type: 'River', state: 'Multiple' },
  { name: 'Indus', type: 'River', state: 'Multiple' },
  { name: 'Sutlej', type: 'River', state: 'Multiple' },
  { name: 'Beas', type: 'River', state: 'Punjab' },
  { name: 'Ravi', type: 'River', state: 'Punjab' },
  { name: 'Chambal', type: 'River', state: 'Multiple' },
  { name: 'Mahanadi', type: 'River', state: 'Odisha' },
  { name: 'Tapti', type: 'River', state: 'Multiple' },
  
  // Estuaries
  { name: 'Sundarbans Estuary', type: 'Estuary', state: 'West Bengal' },
  { name: 'Hooghly Estuary', type: 'Estuary', state: 'West Bengal' },
  { name: 'Chilika Lagoon', type: 'Estuary', state: 'Odisha' },
  { name: 'Vembanad Lagoon', type: 'Estuary', state: 'Kerala' },
  
  // Coastal Stretches
  { name: 'Arabian Sea Coast', type: 'Coastal Stretch', state: 'Multiple' },
  { name: 'Bay of Bengal Coast', type: 'Coastal Stretch', state: 'Multiple' },
  { name: 'Indian Ocean Coast', type: 'Coastal Stretch', state: 'Multiple' },
]

export default function RiverSelector({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState(WATER_BODIES)
  const [searchTerm, setSearchTerm] = useState(value)
  const containerRef = useRef(null)

  useEffect(() => {
    if (searchTerm) {
      const results = WATER_BODIES.filter((wb) =>
        wb.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFiltered(results)
    } else {
      setFiltered(WATER_BODIES)
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

  const handleSelect = (waterbody) => {
    onChange(waterbody.name)
    setSearchTerm(waterbody.name)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  return (
    <div className="form-group autocomplete-container" ref={containerRef}>
      <label htmlFor="river">Select River/Estuary/Coastal Stretch</label>
      <div className="autocomplete-wrapper">
        <input
          id="river"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search water body..."
          className="form-input autocomplete-input"
          autoComplete="off"
        />
        {isOpen && filtered.length > 0 && (
          <div className="autocomplete-dropdown">
            {filtered.map((wb, idx) => (
              <div
                key={idx}
                className={`autocomplete-item ${wb.name === value ? 'selected' : ''}`}
                onClick={() => handleSelect(wb)}
              >
                <div className="item-name">{wb.name}</div>
                <div className="item-meta">{wb.type} • {wb.state}</div>
              </div>
            ))}
          </div>
        )}
        {isOpen && searchTerm && filtered.length === 0 && (
          <div className="autocomplete-dropdown">
            <div className="autocomplete-item no-results">No water bodies found</div>
          </div>
        )}
      </div>
    </div>
  )
}

