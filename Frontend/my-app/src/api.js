/**
 * Backend API base URL.
 * In dev: use /api so Vite proxy forwards to localhost:8000 (no CORS).
 * In prod: use VITE_BACKEND_URL or fallback to http://localhost:8000.
 */
export function getBackendBase() {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')
  }
  if (import.meta.env.DEV) {
    return '/api'
  }
  return 'http://localhost:8000'
}
