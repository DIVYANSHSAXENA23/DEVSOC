# Backend API - Fish Advisory System

REST API backend for the Species-wise Juvenile Fish Density Mapping and Sustainable Fishing Advisory System.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r Backend/requirements.txt
```

**Note:** You also need the ML dependencies. Install them from the ML folder:
```bash
pip install -r ML/requirements.txt
```

### 2. Set Data Path (Optional)

If your CSV file is in a different location, set the environment variable:

**Windows:**
```bash
set FISH_DATA_PATH=C:\path\to\your\indian_fish_dataset.csv
```

**Linux/Mac:**
```bash
export FISH_DATA_PATH=/path/to/your/indian_fish_dataset.csv
```

Or update the default path in `api.py` line 84.

### 3. Start the API Server

```bash
python Backend/start_api.py
```

The API will start at: **http://localhost:8000**

---

## 📚 API Endpoints

### POST `/advisory` - Get Fish Advisories ⭐
**Main endpoint for your website.**

**Request:**
```json
{
  "state": "Kerala",
  "river_name": "Periyar"
}
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "state": "Kerala",
  "river_name": "Periyar",
  "advisories": [
    {
      "species": "Pampus argenteus",
      "latitude": 9.93,
      "longitude": 77.12,
      "zone": "Green",
      "risk_factors": [...],
      "fishing_advisory": "...",
      "recommended_gear": "...",
      "economic_note": "...",
      "river_name": "Periyar"
    }
  ]
}
```

### GET `/health` - Health Check
Check if the API and model are loaded.

### GET `/states` - Get Available States
Get a list of all states available in the dataset.

### GET `/docs` - API Documentation
Interactive Swagger UI documentation at http://localhost:8000/docs

---

## 🧪 Testing

Run the test script to verify everything works:

```bash
python Backend/test_api.py
```

---

## 🌐 Frontend Integration

### JavaScript Example

```javascript
const response = await fetch('http://localhost:8000/advisory', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    state: 'Kerala',
    river_name: 'Periyar'
  })
});

const data = await response.json();
console.log(`Found ${data.count} advisories`);
```

---

## 📁 Project Structure

```
DEVSOC/
├── Backend/          # Backend API code
│   ├── api.py        # FastAPI application
│   ├── start_api.py  # Server startup script
│   ├── test_api.py   # Test script
│   └── requirements.txt
├── ML/               # Machine Learning pipeline
│   └── fish_advisory_pipeline.py
└── Frontend/         # Frontend website code
```

---

## 🔧 Configuration

- **Port:** Default is 8000 (change in `start_api.py`)
- **Host:** Default is `0.0.0.0` (all interfaces)
- **CORS:** Currently allows all origins (update in `api.py` for production)

---

## 📖 Full Documentation

See `ML/API_USAGE.md` for complete API documentation and example

