import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const user = localStorage.getItem('user')

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          FinTrack
        </Link>
        <nav className="header-nav">
          {user ? (
            <>
              <Link to="/dashboard" className="header-btn dashboard-btn">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.href = '/'
                }}
                className="header-btn logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn login-btn">
                Login
              </Link>
              <Link to="/signup" className="header-btn signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
