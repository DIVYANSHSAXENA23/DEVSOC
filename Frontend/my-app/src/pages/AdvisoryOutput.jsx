import { useEffect, useState } from 'react'
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
  const [showHeatmap, setShowHeatmap] = useState(false)

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

      <div className="advisory-output-container page-fade-up">
        <div className="advisory-output-header">
          <div className="advisory-title-block">
            <h1>Advisory Results</h1>
            <div className="advisory-context">
              <span className="context-pill">
                <span className="context-label">State</span>
                <span className="context-value">{stateName}</span>
              </span>
              <span className="context-pill">
                <span className="context-label">River</span>
                <span className="context-value">{riverName}</span>
              </span>
            </div>
          </div>

          <div className="advisory-actions">
            <button
              type="button"
              className="heatmap-toggle-btn"
              onClick={() => setShowHeatmap(true)}
            >
              Juvenile Risk Heatmap
            </button>
            <button
              type="button"
              className="back-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="advisory-output-layout advisory-output-layout-single">
          <div className="advisory-panel result-panel result-panel-full">
            <div className="panel-head">
              <h2>Advisory Output</h2>
              <p className="panel-subtitle">
                Species-wise recommendations with risk zones and details.
              </p>
            </div>
            <ResultDisplay result={result} loading={false} error={null} />
          </div>
        </div>
      </div>

      {showHeatmap && (
        <div
          className="heatmap-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Juvenile Risk Heatmap"
          onClick={() => setShowHeatmap(false)}
        >
          <div className="heatmap-drawer loading-fade" onClick={(e) => e.stopPropagation()}>
            <div className="heatmap-drawer-header">
              <div>
                <h2>Juvenile Risk Heatmap</h2>
                <p>
                  Visual density map for <strong>{riverName}</strong> in{' '}
                  <strong>{stateName}</strong>
                </p>
              </div>
              <button
                type="button"
                className="heatmap-close-btn"
                onClick={() => setShowHeatmap(false)}
                aria-label="Close heatmap"
              >
                ✕
              </button>
            </div>
            <div className="heatmap-drawer-body">
              <HeatmapView stateName={stateName} riverName={riverName} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
