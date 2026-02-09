# DEVSOC — Fish Advisory & Heatmap (Hackathon Ready)

Species-wise juvenile fish density mapping and sustainable fishing advisory, with ML-backed advisories and risk heatmap.

## Quick start (both must run)

### 1. Backend (API + ML)

```bash
cd Backend
pip install -r requirements.txt
pip install -r ML/requirements.txt
python start_api.py
```

- API: **http://localhost:8000**
- Docs: **http://localhost:8000/docs**
- Uses `Backend/converted_final.csv` (set `FISH_DATA_PATH` to use another file).

### 2. Frontend

```bash
cd Frontend/my-app
npm install
npm run dev
```

- App: **http://localhost:5173**
- In dev, requests to `/api` are proxied to the backend (no CORS). **Start the backend first** so state/river lists, advisories, and heatmap load from the API.

## Flow

1. **Login** → Dashboard.
2. **Select State** (e.g. Kerala, Karnataka) — states/rivers come from the CSV via API (with fallback if backend is down).
3. **Select River** (e.g. Periyar, Krishna).
4. **Get Advisory** — ML advisories and species zones.
5. **Heatmap** — risk points for the selected state + river (map with circle markers).

## Project layout

- **Backend/** — FastAPI, `/advisory`, `/heatmap`, `/states`, `/rivers`; ML in `ML/fish_advisory_pipeline.py`.
- **Frontend/my-app/** — React + Vite; Dashboard, HeatmapView, StateSelector, RiverSelector.

## Production

- Backend: run from `Backend/` (e.g. `uvicorn api:app --host 0.0.0.0 --port 8000`).
- Frontend: `npm run build` in `Frontend/my-app`, then set `VITE_BACKEND_URL` to your API URL and serve `dist/`.
