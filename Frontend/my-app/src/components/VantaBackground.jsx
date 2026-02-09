import { useEffect, useRef } from 'react'
import './VantaBackground.css'

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })

export default function VantaBackground({ effect = 'WAVES', color = 0x5a8df0, options = {} }) {
  const ref = useRef(null)
  const vantaRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
        }

        const effectMap = {
          WAVES: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js',
          NET: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js',
          GLOBE: 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js',
        }

        const src = effectMap[effect] || effectMap.WAVES
        if (!window.VANTA) await loadScript(src)

        if (window.VANTA && ref.current && !vantaRef.current && mounted) {
          const ctor = window.VANTA[effect] || window.VANTA.WAVES
          const defaultOpts = {
            el: ref.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            scale: 1.0,
            scaleMobile: 1.0,
            color,
            backgroundColor: 0x071029,
          }

          const merged = { ...defaultOpts, ...options }
          if (effect === 'WAVES') {
            merged.waveHeight = merged.waveHeight ?? 18
            merged.waveSpeed = merged.waveSpeed ?? 0.6
            merged.zoom = merged.zoom ?? 0.78
          }

          vantaRef.current = ctor(merged)
        }
      } catch (err) {
        // Fail quietly — Vanta is a progressive enhancement
        // eslint-disable-next-line no-console
        console.error('Vanta init error', err)
      }
    }

    const t = setTimeout(init, 150)
    return () => {
      mounted = false
      clearTimeout(t)
      if (vantaRef.current) {
        try {
          vantaRef.current.destroy()
        } catch (e) {
          // ignore
        }
        vantaRef.current = null
      }
    }
  }, [effect, color])

  return <div className="vanta-wrapper" ref={ref} aria-hidden="true" />
}
