import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import VantaBackground from '../components/VantaBackground'
import Footer from '../components/Footer'
import SpeciesSelector from '../components/SpeciesSelector'
import LocationInput from '../components/LocationInput'
import RiverSelector from '../components/RiverSelector'
import ResultDisplay from '../components/ResultDisplay'
import './Dashboard.css'

export default function Dashboard() {
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
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
    if (!species || !location || !river) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const payload = {
        species,
        location,
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
          prediction: `Analysis for ${species} in ${location}, ${river}`,
          risk_level: 'Medium',
          details: 'Demo response - Backend not connected. Please ensure your FastAPI server is running.',
          chart_url: null,
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
      <Navbar />
      
      <div className="dashboard-header">
        <h1>ML Environmental Analysis</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="analysis-section">
          <div className="card analysis-card">
            <h2>Enter Analysis Details</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="analysis-form">
              <SpeciesSelector value={species} onChange={setSpecies} />
              <LocationInput value={location} onChange={setLocation} />
              <RiverSelector value={river} onChange={setRiver} />
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </form>
          </div>
        </div>

        <div className="results-section">
          <div className="card results-card">
            <h2>Analysis Results</h2>
            <ResultDisplay result={result} loading={loading} error={error} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
