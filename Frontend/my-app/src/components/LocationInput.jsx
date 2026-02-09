import './FormComponents.css'

export default function LocationInput({ value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor="location">Enter Location</label>
      <input
        id="location"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Kanpur, Delhi, Mumbai"
        className="form-input"
      />
    </div>
  )
}
