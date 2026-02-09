# Backend Integration Guide

This guide will help you connect the FinTrack frontend to your FastAPI backend for the ML analysis.

## Quick Start

### 1. Backend Requirements

Your FastAPI backend should have:

**Endpoint**: `POST /api/analyze`

**Request Format**:
```json
{
  "species": "String",
  "location": "String",
  "river": "String"
}
```

**Expected Response**:
```json
{
  "prediction": "String describing the analysis result",
  "risk_level": "Low | Medium | High",
  "details": "Additional details about the analysis",
  "chart_url": "Optional URL to chart/heatmap image or null"
}
```

### 2. Setup CORS in FastAPI

Add CORS middleware to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Frontend Configuration

#### Set Environment Variables

Create `.env` file in `DEVSOC/Frontend/my-app/`:

```
VITE_BACKEND_URL=http://localhost:8000
VITE_APP_ENV=development
```

For production:
```
VITE_BACKEND_URL=https://your-production-backend.com
VITE_APP_ENV=production
```

#### Example Backend Implementation (FastAPI)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class AnalysisRequest(BaseModel):
    species: str
    location: str
    river: str

class AnalysisResponse(BaseModel):
    prediction: str
    risk_level: str  # "Low", "Medium", "High"
    details: Optional[str] = None
    chart_url: Optional[str] = None

@app.post("/api/analyze")
async def analyze(request: AnalysisRequest) -> AnalysisResponse:
    """
    Analyze water quality and ecosystem health
    """
    # Your ML model analysis logic here
    try:
        species = request.species
        location = request.location
        river = request.river
        
        # Example: Call your ML model
        # prediction = ml_model.predict(species, location, river)
        
        return AnalysisResponse(
            prediction=f"Water quality analysis for {species} in {location}, {river}",
            risk_level="Medium",
            details="Sample details from your ML model",
            chart_url=None  # or URL to generated chart
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## API Response Examples

### Success Response (Risk Level = Low)
```json
{
  "prediction": "Excellent water quality detected in the Ganga at Kanpur. Fish population is healthy and thriving.",
  "risk_level": "Low",
  "details": "pH: 7.2, Dissolved Oxygen: 8.5 mg/L, Temperature: 24°C. All parameters within acceptable range.",
  "chart_url": "https://backend.com/charts/analysis_123.png"
}
```

### Success Response (Risk Level = High)
```json
{
  "prediction": "Critical pollution levels detected. Immediate action recommended.",
  "risk_level": "High",
  "details": "High levels of heavy metals and low oxygen content detected.",
  "chart_url": "https://backend.com/charts/analysis_456.png"
}
```

### Error Response
```json
{
  "detail": "Invalid species or location"
}
```

## Frontend API Call Flow

The Dashboard component handles the API call like this:

```javascript
// In Dashboard.jsx
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const response = await axios.post(
  `${BACKEND_URL}/api/analyze`,
  {
    species,
    location,
    river,
  },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
)

setResult(response.data)
```

## Testing the Integration

### 1. Start Your Backend
```bash
python -m uvicorn main:app --reload
# Backend running on http://localhost:8000
```

### 2. Start the Frontend
```bash
cd DEVSOC/Frontend/my-app
npm run dev
# Frontend running on http://localhost:5173 (or another port)
```

### 3. Test the Flow
1. Open http://localhost:5173
2. Click "Get Started"
3. Login (any email/password ≥6 chars)
4. Fill in the form with test data
5. Click "Analyze"
6. Results should appear from your backend

### 4. Check Browser DevTools
- **Network tab**: See the POST request and response
- **Console**: Check for any JavaScript errors
- **Application**: Verify localStorage contains user data

## Debugging Tips

### Frontend Debugging

Check if backend is accessible:
```javascript
// Open browser console and run:
fetch('http://localhost:8000/docs')
  .then(r => console.log(r.status))
  .catch(e => console.error(e))
```

### Backend Debugging

Add logging to your FastAPI endpoint:
```python
@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    print(f"Received request: {request}")
    print(f"Species: {request.species}")
    print(f"Location: {request.location}")
    print(f"River: {request.river}")
    # ... rest of code
```

## Common Issues

### Issue: CORS Error
**Solution**: Add CORS middleware to your FastAPI app (see above)

### Issue: 404 Not Found
**Solution**: Ensure endpoint is `/api/analyze` and uses POST method

### Issue: Backend URL Not Found
**Solution**: 
1. Check `.env` file has correct URL
2. Verify Vite can read env variables with `import.meta.env.VITE_BACKEND_URL`
3. Rebuild if environment variables changed

### Issue: Timeout on Large Analysis
**Solution**: Increase timeout in axios call:
```javascript
const response = await axios.post(
  `${BACKEND_URL}/api/analyze`,
  payload,
  {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000  // 30 seconds
  }
)
```

## Performance Optimization

### For Large Datasets
```python
# Add streaming or chunked responses
@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    # Implement your analysis with progress feedback
    # Can send intermediate results
```

### For ML Model Loading
```python
# Load model once at startup, not per request
from contextlib import asynccontextmanager

ml_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on startup
    global ml_model
    ml_model = load_model()
    yield
    # Cleanup on shutdown

app = FastAPI(lifespan=lifespan)
```

## Deployment

### Environment Variables for Production

Update `.env` in production:
```
VITE_BACKEND_URL=https://your-api.example.com
VITE_APP_ENV=production
```

### Build for Production
```bash
npm run build
# Creates optimized dist/ folder for deployment
```

### Deploy to Services
- **Vercel**: Connect GitHub repo, auto-deploys on push
- **Netlify**: Drop dist/ folder or connect GitHub
- **AWS S3 + CloudFront**: Upload dist/ to S3
- **Docker**: Create Dockerfile for containerized deployment

## Monitoring & Analytics

Consider adding to your backend:
- Request logging
- Error tracking (Sentry)
- Performance monitoring
- Rate limiting for API

## Example ML Model Integration

```python
import joblib
import numpy as np

# Load model at startup
model = joblib.load('water_quality_model.pkl')

@app.post("/api/analyze")
async def analyze(request: AnalysisRequest):
    # Encode inputs
    species_encode = encode_species(request.species)
    location_encode = encode_location(request.location)
    river_encode = encode_river(request.river)
    
    # Prepare features
    features = np.array([[species_encode, location_encode, river_encode]])
    
    # Predict
    prediction = model.predict(features)[0]
    risk_level = get_risk_level(prediction)
    
    return AnalysisResponse(
        prediction=f"Analysis: {prediction}",
        risk_level=risk_level,
        details=f"Confidence: {model.predict_proba(features)[0].max():.2%}",
        chart_url=None
    )
```

## Need Help?

1. Check frontend console: F12 → Console tab
2. Check network requests: F12 → Network tab
3. Ensure backend is accessible: Visit http://localhost:8000/docs (FastAPI Swagger UI)
4. Review CORS error messages for clues
5. Test with curl or Postman first:

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"species":"Fish","location":"Kanpur","river":"Ganga"}'
```

---

**Ready to integrate! 🚀**
