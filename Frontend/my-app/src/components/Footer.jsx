import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <span className="footer-brand">FinTrack</span>
          <span className="footer-copyright">© {currentYear} FinTrack. All rights reserved.</span>
        </div>
        <div className="footer-middle">
          <a href="#privacy" className="footer-link">Privacy</a>
          <span className="footer-sep">•</span>
          <a href="#terms" className="footer-link">Terms</a>
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
