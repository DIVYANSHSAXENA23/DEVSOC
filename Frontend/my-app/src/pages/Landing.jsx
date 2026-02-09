import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import VantaBackground from '../components/VantaBackground'
import Footer from '../components/Footer'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      navigate('/dashboard')
    }
  }, [navigate])

  return (
    <div className="landing-page">
      <VantaBackground effect="WAVES" />
      <Navbar />

      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">FinTrack</h1>
          <p className="hero-subtitle">AI environmental insights</p>
          <p className="hero-description">
            Actionable monitoring and clear analysis for aquatic ecosystems —
            minimal UI, maximum clarity.
          </p>

          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/learn-more" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <div className="floating-shapes" aria-hidden>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <Footer />
    </div>
  )
}
