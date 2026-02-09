"""
FastAPI Backend for Fish Advisory System
Provides REST API endpoints for querying fish advisories by state and river.
"""

import os
import sys
from typing import List, Dict, Any, Optional
from pathlib import Path

# Add parent directory to path to import from ML folder
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ML.fish_advisory_pipeline import (
    load_and_preprocess,
    train_zone_classifier,
    generate_advisories_for_state,
    generate_heatmap_points,
)

# Initialize FastAPI app
app = FastAPI(
    title="Fish Advisory API",
    description="Species-wise Juvenile Fish Density Mapping and Sustainable Fishing Advisory System",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to cache model and data
model = None
df_full = None
model_loaded = False


# Request/Response Models
class AdvisoryRequest(BaseModel):
    state: str = Field(..., description="Indian coastal state name (e.g., 'Kerala')")
    river_name: str = Field(..., description="River/estuary name (e.g., 'Periyar')")

    class Config:
        json_schema_extra = {
            "example": {
                "state": "Kerala",
                "river_name": "Periyar"
            }
        }


class AdvisoryResponse(BaseModel):
    species: str
    latitude: float
    longitude: float
    zone: str
    risk_factors: List[str]
    fishing_advisory: str
    recommended_gear: str
    economic_note: str
    river_name: str


class AdvisoryListResponse(BaseModel):
    success: bool
    count: int
    state: str
    river_name: str
    advisories: List[AdvisoryResponse]


class HeatmapRequest(BaseModel):
    state: str = Field(..., description="Indian coastal state name (e.g., 'Kerala')")
    river_name: str = Field(..., description="River name (e.g., 'Periyar')")
    weight: str = Field(
        default="juvenile_risk_prob",
        description="Heatmap weight: juvenile_risk_prob | juvenile_risk_score | chlorophyll_mg_m3 | depth_m",
    )


class HeatmapPoint(BaseModel):
    lat: float
    lon: float
    value: float


class HeatmapResponse(BaseModel):
    success: bool
    state: str
    river_name: str
    weight: str
    count: int
    points: List[HeatmapPoint]


def load_model():
    """Load and train the model once on startup."""
    global model, df_full, model_loaded
    
    if model_loaded:
        return
    
    # Data path: env FISH_DATA_PATH, or Backend/converted_final.csv
    default_path = Path(__file__).parent / "converted_final.csv"
    data_path = os.getenv("FISH_DATA_PATH", str(default_path))

    # Check if file exists
    if not Path(data_path).exists():
        raise FileNotFoundError(
            f"Dataset file not found at: {data_path}\n"
            "Please set FISH_DATA_PATH environment variable or update the default path in api.py"
        )
    
    print("Loading and preprocessing data...")
    X, y, pre, df_full = load_and_preprocess(data_path)
    
    print("Training model...")
    model, eval_results = train_zone_classifier(X, y, pre)
    
    print(f"Model loaded successfully! Accuracy: {eval_results['accuracy']:.3f}")
    model_loaded = True


@app.on_event("startup")
async def startup_event():
    """Load model when API starts."""
    load_model()


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Fish Advisory API",
        "version": "1.0.0",
        "endpoints": {
            "/advisory": "POST - Get fish advisories for a state and river",
            "/health": "GET - Health check",
            "/docs": "GET - API documentation (Swagger UI)"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model_loaded
    }


@app.post("/advisory", response_model=AdvisoryListResponse)
async def get_advisory(request: AdvisoryRequest):
    """
    Get fish advisories for a given state and river.
    
    Returns a list of advisory objects, one for each fish species record
    found in the specified state AND river_name.
    """
    if not model_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please wait for initialization."
        )
    
    try:
        # Generate advisories
        advisories = generate_advisories_for_state(
            model=model,
            full_df=df_full,
            state=request.state,
            river_name=request.river_name,
        )
        
        if not advisories:
            raise HTTPException(
                status_code=404,
                detail=f"No fish records found for state: {request.state}"
            )
        
        return {
            "success": True,
            "count": len(advisories),
            "state": request.state,
            "river_name": request.river_name,
            "advisories": advisories
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )


@app.get("/states")
async def get_available_states():
    """Get list of available states in the dataset."""
    if not model_loaded or df_full is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please wait for initialization."
        )

    states = sorted(df_full["state"].unique().tolist())
    return {
        "success": True,
        "count": len(states),
        "states": states
    }


@app.get("/rivers")
async def get_available_rivers(state: Optional[str] = None):
    """Get list of rivers in the dataset, optionally filtered by state."""
    if not model_loaded or df_full is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please wait for initialization."
        )
    if "river_name" not in df_full.columns:
        return {"success": True, "count": 0, "rivers": []}

    subset = df_full
    if state:
        subset = df_full[df_full["state"].str.lower() == state.lower()]
    rivers = sorted(subset["river_name"].astype(str).unique().tolist())
    return {
        "success": True,
        "count": len(rivers),
        "rivers": rivers
    }


@app.post("/heatmap", response_model=HeatmapResponse)
async def get_heatmap(request: HeatmapRequest):
    """
    Returns weighted lat/lon points for a frontend heatmap layer for a given state + river.
    """
    if not model_loaded or df_full is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Please wait for initialization.")

    try:
        points = generate_heatmap_points(
            full_df=df_full,
            state=request.state,
            river_name=request.river_name,
            weight=request.weight,
        )
        # Return 200 with empty list so frontend can show map + "no data" message
        return {
            "success": True,
            "state": request.state,
            "river_name": request.river_name,
            "weight": request.weight,
            "count": len(points),
            "points": points or [],
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating heatmap: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    # Load model before starting server
    load_model()
    
    # Run the API server
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Set to False in production
    )

