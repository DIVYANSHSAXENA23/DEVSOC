"""
Simple script to start the Fish Advisory API server.
Run this file to start the backend API.
"""

import uvicorn
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

from api import load_model

if __name__ == "__main__":
    # Load model first
    print("Initializing Fish Advisory API...")
    load_model()
    
    # Start the server
    print("\nStarting API server on http://localhost:8000")
    print("API Documentation available at: http://localhost:8000/docs")
    print("Press CTRL+C to stop the server\n")
    
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes (set to False in production)
    )

