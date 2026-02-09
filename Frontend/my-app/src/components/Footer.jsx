import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
<<<<<<< HEAD
        <div className="footer-content">
          <div className="footer-section footer-brand-section">
            <div className="footer-logo-wrapper">
              <h3 className="footer-logo">FinTrack</h3>
              <p className="footer-tagline">AI Environmental Insights</p>
            </div>
            <p className="footer-description">
              Actionable monitoring and clear analysis for aquatic ecosystems.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/learn-more">Learn More</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-section-title">Resources</h4>
            <ul className="footer-links">
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} FinTrack. All rights reserved.</p>
          </div>
          <div className="footer-social">
            <span className="social-label">Follow us</span>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="GitHub">→</a>
              <a href="#" className="social-link" aria-label="Twitter">→</a>
              <a href="#" className="social-link" aria-label="LinkedIn">→</a>
            </div>
          </div>
=======
        <div className="footer-left">
          <span className="footer-brand">FinTrack</span>
          <span className="footer-copyright">© {currentYear} FinTrack. All rights reserved.</span>
        </div>
        <div className="footer-middle">
          <a href="#privacy" className="footer-link">Privacy</a>
          <span className="footer-sep">•</span>
          <a href="#terms" className="footer-link">Terms</a>
>>>>>>> fa0824191a54e728956f79612194da43b0a9637f
        </div>
        <div className="footer-right">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
            <span className="social-icon">📷</span>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter">
            <span className="social-icon">𝕏</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
