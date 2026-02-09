import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import { getBackendBase } from '../api'
import 'leaflet/dist/leaflet.css'
import './HeatmapView.css'

export default function HeatmapView({ stateName, riverName }) {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasLocation = !!stateName && !!riverName

  useEffect(() => {
    if (!hasLocation) return

    const fetchHeatmap = async () => {
      setLoading(true)
      setError('')
      try {
        const BACKEND_URL = getBackendBase()
        const response = await axios.post(
          `${BACKEND_URL}/heatmap`,
          {
            state: stateName,
            river_name: riverName,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )

        setPoints(response.data?.points || [])
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load heatmap data.')
        setPoints([])
      } finally {
        setLoading(false)
      }
    }

    fetchHeatmap()
  }, [hasLocation, stateName, riverName])

  const center = useMemo(() => {
    if (!points.length) return [22.5, 79] // approximate center of India
    const avgLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length
    const avgLon = points.reduce((sum, p) => sum + p.lon, 0) / points.length
    return [avgLat, avgLon]
  }, [points])

  const maxValue = useMemo(() => {
    if (!points.length) return 1
    return Math.max(...points.map((p) => p.value || 0.0001))
  }, [points])

  const getRadius = (value) => {
    if (!value || !maxValue) return 4
    const normalized = value / maxValue
    return 6 + normalized * 16 // 6–22 px
  }

  const getColor = (value) => {
    if (!value || !maxValue) return '#4ade80' // green
    const normalized = value / maxValue
    if (normalized > 0.66) return '#ef4444' // red
    if (normalized > 0.33) return '#facc15' // yellow
    return '#4ade80' // green
  }

  return (
    <div className="heatmap-card">
      <div className="heatmap-header">
        <h3>Juvenile Risk Heatmap</h3>
        <p className="heatmap-subtitle">
          Visual density map for {riverName || 'selected river'} in {stateName || 'selected state'}
        </p>
      </div>

      {!hasLocation && (
        <div className="heatmap-placeholder">
          <p>Select a state and river to view the spatial risk heatmap.</p>
        </div>
      )}

      {hasLocation && loading && (
        <div className="heatmap-placeholder">
          <div className="spinner small"></div>
          <p>Loading heatmap...</p>
        </div>
      )}

      {hasLocation && !loading && error && (
        <div className="heatmap-placeholder error">
          <p>{error}</p>
        </div>
      )}

      {hasLocation && !loading && !error && (
        <div className="heatmap-map-wrapper">
          <MapContainer
            key={`heatmap-${stateName}-${riverName}`}
            center={center}
            zoom={points.length ? 8 : 5}
            scrollWheelZoom
            style={{ height: '340px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
            className="heatmap-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.map((p, idx) => (
              <CircleMarker
                key={idx}
                center={[p.lat, p.lon]}
                radius={getRadius(p.value)}
                pathOptions={{
                  color: getColor(p.value),
                  fillColor: getColor(p.value),
                  fillOpacity: 0.5,
                  weight: 1,
                }}
              >
                <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
                  <div>
                    <div>
                      <strong>Intensity:</strong> {p.value.toFixed(3)}
                    </div>
                    <div className="tooltip-muted">
                      {stateName} • {riverName}
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>

          {!points.length && (
            <div className="heatmap-placeholder overlay">
              <p>No spatial records found for this combination. Try another river or state.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

