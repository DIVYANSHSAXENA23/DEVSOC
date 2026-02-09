import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import VantaBackground from '../components/VantaBackground'
import Footer from '../components/Footer'
import StateSelector from '../components/StateSelector'
import RiverSelector from '../components/RiverSelector'
import ResultDisplay from '../components/ResultDisplay'
import './Dashboard.css'

export default function Dashboard() {
  const [state, setState] = useState('')
  const [river, setRiver] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const navigate = useNavigate()

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/login')
    } else {
      setIsAuthed(true)
    }
  }, [navigate])

  if (!isAuthed) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)

    // Validate inputs
    if (!state || !river) {
      setError('Please select both State/Region and River/Estuary')
      setLoading(false)
      return
    }

    try {
      const payload = {
        state,
        river,
      }

      // Replace with your actual backend URL
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
      
      const response = await axios.post(
        `${BACKEND_URL}/api/analyze`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      setResult(response.data)
    } catch (err) {
      // For demo purposes, show a mock response
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network')) {
        // Backend not available, show demo response
        setResult({
          overall_zone: 'Yellow',
          river_name: river,
          species: [
            {
              name: 'Hilsa (Tenualosa ilisha)',
              scientific_name: 'Tenualosa ilisha',
              zone: 'Red',
              latitude: 28.6139,
              longitude: 77.2090,
              risk_factors: ['High juvenile density during monsoon', 'Disease susceptibility in polluted waters', 'Seasonal migration patterns'],
              fishing_advisory: 'Prohibited during breeding season (June-August). Strict regulations apply in spawn aggregation areas.',
              recommended_gear: 'Seine nets with larger mesh size, exclusion zones for juveniles',
              economic_note: 'Value: ₹200-300 per kg. Economic loss from overfishing: ₹50 crores annually in Ganga'
            },
            {
              name: 'Rohu (Labeo rohita)',
              scientific_name: 'Labeo rohita',
              zone: 'Yellow',
              latitude: 28.6155,
              longitude: 77.2080,
              risk_factors: ['Moderate juvenile density', 'Sensitive to temperature variations', 'Competition with invasive species'],
              fishing_advisory: 'Regulated fishing allowed. Minimum catch size: 40cm. Avoid during monsoon breeding.',
              recommended_gear: 'Cast nets, hook and line fishing',
              economic_note: 'Value: ₹120-180 per kg. Important food fish for local communities'
            },
            {
              name: 'Catfish (Ompok pabda)',
              scientific_name: 'Ompok pabda',
              zone: 'Green',
              latitude: 28.6150,
              longitude: 77.2085,
              risk_factors: ['Low population pressure', 'Tolerant to environmental stress', 'Limited commercial fishing'],
              fishing_advisory: 'Sustainable fishing recommended. Good candidate for aquaculture expansion.',
              recommended_gear: 'Traps, gillnets, hand collection',
              economic_note: 'Value: ₹80-120 per kg. Growing demand in aquaculture sector'
            }
          ]
        })
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to analyze. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="dashboard-page">
      <VantaBackground effect="WAVES" />
      <Header />
      
      <div className="dashboard-header">
        <h1>ML Environmental Analysis</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="input-section-wrapper">
          <div className="card input-card">
            <h2>Query Parameters</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="query-form">
              <div className="input-section">
                <h3 className="input-section-title">Geographic Location</h3>
                <StateSelector value={state} onChange={setState} />
                <RiverSelector value={river} onChange={setRiver} />
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Get Advisory'}
              </button>
            </form>
          </div>
        </div>

        <div className="output-section-wrapper">
          <div className="card output-card">
            <h2>Advisory Output</h2>
            <ResultDisplay result={result} loading={loading} error={error} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
