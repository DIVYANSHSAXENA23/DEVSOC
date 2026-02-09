import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const user = localStorage.getItem('user')

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          FinTrack
        </Link>
        <div className="nav-buttons">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-btn dashboard-btn">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.href = '/'
                }}
                className="nav-btn logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn">
                Login
              </Link>
              <Link to="/signup" className="nav-btn signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
