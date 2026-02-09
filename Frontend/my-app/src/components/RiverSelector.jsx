import './FormComponents.css'

const RIVER_OPTIONS = [
  { value: 'Ganga', label: 'Ganga' },
  { value: 'Yamuna', label: 'Yamuna' },
  { value: 'Brahmaputra', label: 'Brahmaputra' },
  { value: 'Godavari', label: 'Godavari' },
  { value: 'Krishna', label: 'Krishna' },
  { value: 'Narmada', label: 'Narmada' },
  { value: 'Indus', label: 'Indus' },
]

export default function RiverSelector({ value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor="river">Select River</label>
      <select 
        id="river" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
      >
        <option value="">-- Choose a river --</option>
        {RIVER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
