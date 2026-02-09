import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-left">
          <span className="footer-brand">FinTrack</span>
          <span className="footer-copyright">© 2026</span>
        </div>
        <div className="footer-right">
          <a href="#privacy" className="footer-link">Privacy</a>
          <span className="footer-sep">•</span>
          <a href="#terms" className="footer-link">Terms</a>
        </div>
      </div>
    </footer>
  )
}
