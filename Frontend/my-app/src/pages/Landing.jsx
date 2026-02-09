import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Landing.css'

// Load external scripts
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

export default function Landing() {
  const containerRef = useRef(null)
  const vantaRef = useRef(null)

  useEffect(() => {
    const initVanta = async () => {
      try {
        // Load Three.js
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
        }
        
        // Load Vanta
        if (!window.VANTA) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js')
        }

        // Initialize Vanta WAVES effect (cursor responsive)
        if (window.VANTA && containerRef.current && !vantaRef.current) {
          vantaRef.current = window.VANTA.WAVES({
            el: containerRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x667eea,
            waveHeight: 20,
            waveSpeed: 0.5,
            zoom: 0.75,
          })
        }
      } catch (error) {
        console.error('Error loading Vanta:', error)
      }
    }

    // Start initialization with a small delay
    const timer = setTimeout(initVanta, 500)

    return () => {
      clearTimeout(timer)
      if (vantaRef.current) {
        vantaRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="landing-page" ref={containerRef}>
      <Navbar />
      
      <div className="landing-content">
        <div className="hero-section">
          <h1 className="hero-title">FinTrack</h1>
          <p className="hero-subtitle">
            AI-Powered Environmental Analysis System
          </p>
          <p className="hero-description">
            Intelligent insights for aquatic ecosystem monitoring
          </p>
          
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Get Started
            </Link>
            <a href="#" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  )
}
