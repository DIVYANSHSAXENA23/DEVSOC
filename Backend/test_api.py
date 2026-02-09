"""
Quick test script to verify the API works with state and river inputs.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from ML.fish_advisory_pipeline import (
    load_and_preprocess,
    train_zone_classifier,
    generate_advisories_for_state,
)

def test_api_logic():
    """Test if the API logic works correctly."""
    print("Testing API logic...")
    print("=" * 50)
    
    # Use the default data path
    data_path = r"c:\Users\Divyansh Saxena\Desktop\converted_final.csv"
    
    if not Path(data_path).exists():
        print(f"ERROR: Dataset file not found at: {data_path}")
        return False
    
    try:
        # Load and preprocess
        print("1. Loading and preprocessing data...")
        X, y, pre, df_full = load_and_preprocess(data_path)
        print("   [OK] Data loaded successfully")
        
        # Train model
        print("2. Training model...")
        model, eval_results = train_zone_classifier(X, y, pre)
        print(f"   [OK] Model trained successfully (Accuracy: {eval_results['accuracy']:.3f})")
        
        # Test with sample inputs
        print("3. Testing with sample inputs...")
        test_state = "Kerala"
        test_river = "Periyar"
        
        print(f"   Input: state='{test_state}', river_name='{test_river}'")
        advisories = generate_advisories_for_state(
            model=model,
            full_df=df_full,
            state=test_state,
            river_name=test_river,
        )
        
        print(f"   [OK] Generated {len(advisories)} advisories")
        
        if len(advisories) > 0:
            print("\n4. Sample output structure:")
            sample = advisories[0]
            print(f"   - species: {sample['species']}")
            print(f"   - zone: {sample['zone']}")
            print(f"   - latitude: {sample['latitude']}")
            print(f"   - longitude: {sample['longitude']}")
            print(f"   - river_name: {sample['river_name']}")
            print(f"   - risk_factors count: {len(sample['risk_factors'])}")
            print(f"   - fishing_advisory: {sample['fishing_advisory'][:80]}...")
            print("\n[SUCCESS] API logic test PASSED!")
            return True
        else:
            print("   [WARNING] No advisories returned (might be normal if state has no records)")
            return True
            
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_api_logic()
    sys.exit(0 if success else 1)

