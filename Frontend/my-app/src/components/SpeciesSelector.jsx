import './FormComponents.css'

const SPECIES_OPTIONS = [
  { value: 'Fish', label: 'Fish' },
  { value: 'Algae', label: 'Algae' },
  { value: 'Microorganisms', label: 'Microorganisms' },
  { value: 'Aquatic Plants', label: 'Aquatic Plants' },
]

export default function SpeciesSelector({ value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor="species">Select Species</label>
      <select 
        id="species" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
      >
        <option value="">-- Choose a species --</option>
        {SPECIES_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
