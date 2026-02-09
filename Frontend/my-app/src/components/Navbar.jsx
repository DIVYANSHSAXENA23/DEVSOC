import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FinTrack
        </Link>
        <div className="nav-buttons">
          <Link to="/login" className="nav-btn login-btn">
            Login
          </Link>
          <Link to="/login" className="nav-btn signup-btn">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
