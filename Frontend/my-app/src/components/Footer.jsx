import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
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
        </div>
      </div>
    </footer>
  )
}
