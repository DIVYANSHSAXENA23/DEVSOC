import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getBackendBase } from '../api'
import Header from '../components/Header'
import VantaBackground from '../components/VantaBackground'
import Footer from '../components/Footer'
import StateSelector from '../components/StateSelector'
import RiverSelector from '../components/RiverSelector'
import HeatmapView from '../components/HeatmapView'
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

  // Clear river when state changes so user picks a river that exists in dataset
  useEffect(() => {
    setRiver('')
  }, [state])

  if (!isAuthed) {
    return null
  }

  const computeOverallZone = (advisories) => {
    if (!advisories || advisories.length === 0) return 'Unknown'
    const zones = advisories.map((a) => (a.zone || '').toString().toLowerCase())
    if (zones.some((z) => z === 'red' || z === 'high')) return 'Red'
    if (zones.some((z) => z === 'yellow' || z === 'medium')) return 'Yellow'
    if (zones.some((z) => z === 'green' || z === 'low')) return 'Green'
    return 'Unknown'
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
        river_name: river,
      }

      const BACKEND_URL = getBackendBase()
      const response = await axios.post(
        `${BACKEND_URL}/advisory`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const data = response.data || {}
      const advisories = data.advisories || []

      const transformed = {
        river_name: data.river_name || river,
        overall_zone: computeOverallZone(advisories),
        species: advisories.map((a) => ({
          name: a.species,
          scientific_name: a.species,
          zone: a.zone,
          latitude: a.latitude,
          longitude: a.longitude,
          risk_factors: a.risk_factors,
          fishing_advisory: a.fishing_advisory,
          recommended_gear: a.recommended_gear,
          economic_note: a.economic_note,
        })),
      }

      setResult(transformed)
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network')) {
        setError('Backend not reachable. Start the API: cd Backend && python start_api.py')
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
                <RiverSelector value={river} onChange={setRiver} state={state} />
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
            <HeatmapView stateName={state} riverName={river} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
