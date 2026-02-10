import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdvisoryOutput from './pages/AdvisoryOutput'
import LearnMore from './pages/LearnMore'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/advisory" element={<AdvisoryOutput />} />
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
    </Router>
  )
}

export default App
