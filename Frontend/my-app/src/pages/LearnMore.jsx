import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LearnMore.css'

export default function LearnMore() {
  const [openSection, setOpenSection] = useState(1)
  const [checked, setChecked] = useState({})

  const toggleCheck = (i) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))

  const Section = ({ id, title, children }) => {
    const isOpen = openSection === id
    return (
      <section style={{ marginBottom: 24 }}>
        <h2
          onClick={() => setOpenSection(isOpen ? null : id)}
          style={{
            cursor: 'pointer',
            background: '#f3f4f6',
            padding: '12px 16px',
            borderRadius: 8
          }}
        >
          {title}
        </h2>
        {isOpen && (
          <div
            style={{
              padding: '16px',
              marginTop: 8,
              borderRadius: 8,
              background: '#e0f2fe' // single background color for expanded content
            }}
          >
            {children}
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="learnmore-page">
      <Header />
      <main className="learnmore-content">
      <h1 style={{ marginBottom: 24 }}>Learn More</h1>

      <Section id={1} title="1. What FinTrack Is">
        <p>
          FinTrack is an advisory tool that provides location-specific guidance
          about fishing conditions and risks. It summarizes available
          environmental information and translates it into clear advisories for
          fish species and river locations so users can make better-informed
          decisions.
        </p>
      </Section>

      <Section id={2} title="2. How FinTrack Works">
        <ul>
          <li>You enter a state name and a river name.</li>
          <li>
            The system locates available data for the requested river and nearby
            monitoring points.
          </li>
          <li>
            Data and models are used to assess conditions that affect fish and
            fishing safety.
          </li>
          <li>
            For each species present, FinTrack returns advisory details including
            a risk zone and practical recommendations.
          </li>
        </ul>
        <p style={{ color: '#374151' }}>
          Results are presented as human-readable advisories organized by species
          and location.
        </p>
      </Section>

      <Section id={3} title="3. Understanding Advisory Zones">
        <ul>
          <li>
            <strong>Green — Low risk</strong>: Suitable for fishing under normal
            practices. No major restrictions are recommended.
          </li>
          <li>
            <strong>Yellow — Moderate risk</strong>: Controlled or restricted
            fishing is advised. Exercise caution and limit handling or catch.
          </li>
          <li>
            <strong>Red — High risk</strong>: Temporary closure or minimal
            fishing recommended. Avoid fishing until conditions improve.
          </li>
        </ul>
        <p style={{ color: '#374151', marginTop: 12 }}>
          Zones are guidance tools. Local regulations always take precedence.
        </p>
      </Section>

      <Section id={4} title="4. Understanding Advisory Data">
        <ul>
          <li>
            <strong>Species</strong>: The fish species the advisory applies to.
          </li>
          <li>
            <strong>Latitude / Longitude</strong>: Approximate coordinates where
            the advisory applies.
          </li>
          <li>
            <strong>Zone (Green / Yellow / Red)</strong>: Summary of risk and
            activity level.
          </li>
          <li>
            <strong>Risk factors</strong>: Key reasons for the advisory.
          </li>
          <li>
            <strong>Fishing advisory</strong>: Plain-language recommendation.
          </li>
          <li>
            <strong>Recommended gear</strong>: Suggested gear or handling practices.
          </li>
          <li>
            <strong>Economic note</strong>: Brief remark on potential economic implications.
          </li>
          <li>
            <strong>River name</strong>: The river associated with the advisory.
          </li>
        </ul>
      </Section>

      <Section id={5} title="5. Why This Matters">
        <ul>
          <li>
            <strong>Health</strong>: Reduces exposure to contaminated fish.
          </li>
          <li>
            <strong>Environment</strong>: Protects juvenile and vulnerable species.
          </li>
          <li>
            <strong>Livelihoods</strong>: Supports planning for fishers, markets, and businesses.
          </li>
          <li>
            <strong>Resource management</strong>: Advisory data can inform temporary restrictions and recovery actions.
          </li>
        </ul>
      </Section>

      <Section id={6} title="6. Data & Technology (High-Level Overview)">
        <ul>
          <li>Environmental and historical data sources.</li>
          <li>Statistical and ML-based risk estimation.</li>
          <li>Results presented with clear explanations.</li>
          <li>Accuracy depends on data quality and coverage.</li>
        </ul>
      </Section>

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
      <Footer />
    </div>
  )
}
