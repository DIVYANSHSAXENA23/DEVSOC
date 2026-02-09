<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VantaBackground from '../components/VantaBackground'
import './LearnMore.css'

function Chevron({ open }) {
  return (
    <span className={`chev ${open ? 'open' : ''}`} aria-hidden>
      ›
    </span>
  )
}

const Section = ({ id, title, isOpen, onToggle, children }) => {
  const contentRef = useRef(null)
  const [height, setHeight] = useState('72px')

  useEffect(() => {
    if (contentRef.current) {
      const full = `${contentRef.current.scrollHeight}px`
      setHeight(isOpen ? full : '72px')
    }
  }, [isOpen])

  return (
    <section className="lm-section" aria-expanded={isOpen}>
      <button className="lm-header" onClick={() => onToggle(id)}>
        <div className="lm-title">{title}</div>
        <Chevron open={isOpen} />
      </button>

      <div
        ref={contentRef}
        className={`lm-content ${isOpen ? 'open' : ''}`}
        style={{ maxHeight: height }}
      >
        <div className="lm-content-inner">{children}</div>
      </div>
    </section>
  )
}
=======
import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LearnMore.css'
>>>>>>> fa0824191a54e728956f79612194da43b0a9637f

export default function LearnMore() {
  const [openSection, setOpenSection] = useState(1)
  const [checked, setChecked] = useState({})

  const toggleCheck = (i) => setChecked((p) => ({ ...p, [i]: !p[i] }))
  const toggleSection = (id) => setOpenSection((s) => (s === id ? null : id))

  return (
    <div className="learnmore-page">
<<<<<<< HEAD
      <VantaBackground effect="WAVES" />
      <Navbar />
=======
      <Header />
      <main className="learnmore-content">
      <h1 style={{ marginBottom: 24 }}>Learn More</h1>
>>>>>>> fa0824191a54e728956f79612194da43b0a9637f

      <main className="lm-main">
        <header className="lm-hero">
          <h1>Learn More</h1>
          <p className="lm-sub">How FinTrack produces actionable advisories</p>
        </header>

        <div className="lm-grid">
          <Section id={1} title="What FinTrack Is" isOpen={openSection === 1} onToggle={toggleSection}>
            <p>
              FinTrack is an advisory tool that provides location-specific guidance about fishing
              conditions and risks. It summarizes environmental data and presents clear advisories
              organized by species and site to help users make safer, better-informed choices.
            </p>
          </Section>

          <Section id={2} title="How FinTrack Works" isOpen={openSection === 2} onToggle={toggleSection}>
            <ul className="lm-list">
              <li>You enter a state and river name.</li>
              <li>The system gathers available monitoring data for the area.</li>
              <li>Models assess conditions and generate species-level advisories.</li>
              <li>Results are translated into plain-language recommendations.</li>
            </ul>
          </Section>

          <Section id={3} title="Understanding Advisory Zones" isOpen={openSection === 3} onToggle={toggleSection}>
            <div className="zones">
              <div className="zone green"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#9de6a1"/><path d="M8.5 12.5c1.333-2 4.667-2 6 0" stroke="#145214" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Green — Low risk</div>
              <div className="zone yellow"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#fff0a8"/><path d="M12 7v6l3 3" stroke="#6b4b00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Yellow — Moderate risk</div>
              <div className="zone red"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#ffb7b7"/><path d="M7 7l10 10M17 7L7 17" stroke="#5e0b0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Red — High risk</div>
            </div>
            <p className="muted">Zones are guidance. Follow local regulations first.</p>
          </Section>

          <Section id={4} title="Understanding Advisory Data" isOpen={openSection === 4} onToggle={toggleSection}>
            <ul className="lm-list">
              <li><strong>Species</strong>: Which fish are affected.</li>
              <li><strong>Coordinates</strong>: Approximate location of advisory.</li>
              <li><strong>Zone</strong>: Risk level and activity guidance.</li>
              <li><strong>Risk factors</strong>: Why the advisory was issued.</li>
            </ul>
          </Section>

          <Section id={5} title="Why This Matters" isOpen={openSection === 5} onToggle={toggleSection}>
            <ul className="lm-list">
              <li><strong>Health</strong>: Reduce exposure to contaminants.</li>
              <li><strong>Environment</strong>: Protect sensitive species.</li>
              <li><strong>Livelihoods</strong>: Help planners and fishers act safely.</li>
            </ul>
          </Section>

<<<<<<< HEAD
          <Section id={6} title="Data & Technology" isOpen={openSection === 6} onToggle={toggleSection}>
            <ul className="lm-list">
              <li>Environmental monitoring and historical datasets.</li>
              <li>Statistical and ML-based risk estimation pipelines.</li>
              <li>Clear summaries with confidence notes based on data quality.</li>
            </ul>
          </Section>

          <Section id={7} title="How to Use the Results" isOpen={openSection === 7} onToggle={toggleSection}>
            {[
              'Read the zone first (Green, Yellow, Red).',
              'Review risk factors and advisory text.',
              'Confirm location using coordinates.',
              'Follow recommended gear and handling practice.',
              'Use extra caution for Yellow or Red zones.'
            ].map((item, i) => (
              <label key={i} className={`lm-check ${checked[i] ? 'done' : ''}`}>
                <input type="checkbox" checked={!!checked[i]} onChange={() => toggleCheck(i)} />
                <span className="lm-check-label">{item}</span>
              </label>
            ))}
          </Section>
        </div>
      </main>

=======
      <Section id={7} title="7. How to Use the Results">
        {[
          'Read the zone first (Green, Yellow, Red).',
          'Review risk factors and advisory text.',
          'Confirm location using coordinates.',
          'Follow recommended gear practices.',
          'Consider economic notes for planning.',
          'Use extra caution for Yellow or Red zones.'
        ].map((item, i) => (
          <label
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              marginBottom: 8
            }}
          >
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={() => toggleCheck(i)}
            />
            <span
              style={{
                textDecoration: checked[i] ? 'line-through' : 'none',
                color: checked[i] ? '#6b7280' : '#111'
              }}
            >
              {item}
            </span>
          </label>
        ))}
      </Section>
      </main>
>>>>>>> fa0824191a54e728956f79612194da43b0a9637f
      <Footer />
    </div>
  )
}
