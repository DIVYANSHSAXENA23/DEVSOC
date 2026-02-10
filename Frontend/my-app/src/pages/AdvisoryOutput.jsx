import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import VantaBackground from '../components/VantaBackground'
import Footer from '../components/Footer'
import HeatmapView from '../components/HeatmapView'
import ResultDisplay from '../components/ResultDisplay'
import './AdvisoryOutput.css'

export default function AdvisoryOutput() {
  const navigate = useNavigate()
  const location = useLocation()
  const { result, state: stateName, river: riverName } = location.state || {}

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/login')
      return
    }
    if (!result && !stateName && !riverName) {
      navigate('/dashboard')
    }
  }, [navigate, result, stateName, riverName])

  const isAuthed = !!localStorage.getItem('user')
  if (!isAuthed) return null
  if (!location.state) return null

  return (
    <div className="advisory-output-page">
      <VantaBackground effect="WAVES" />
      <Header />

      <div className="advisory-output-container">
        <div className="advisory-output-header">
          <h1>Advisory Results</h1>
          <button
            type="button"
            className="back-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="advisory-output-layout">
          <div className="advisory-panel heatmap-panel">
            <HeatmapView stateName={stateName} riverName={riverName} />
          </div>
          <div className="advisory-panel result-panel">
            <h2>Advisory Output</h2>
            <ResultDisplay result={result} loading={false} error={null} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
