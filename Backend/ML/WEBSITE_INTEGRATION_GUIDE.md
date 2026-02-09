# Website Integration Guide

## 📥 **USER INPUTS (Website Form)**

Your website form should collect **2 required inputs**:

1. **State Name** (text input/dropdown)
   - Examples: `"Kerala"`, `"Tamil Nadu"`, `"Maharashtra"`, `"West Bengal"`, etc.
   - Should match Indian coastal state names from your dataset

2. **River Name** (text input)
   - Examples: `"Periyar"`, `"Ganges"`, `"Godavari"`, `"Krishna"`, etc.
   - This is used as a label/tag in the output (not used for filtering)

---

## 📤 **OUTPUT (What Your Website Will Receive)**

After submitting the form, your backend will call the ML pipeline and return a **JSON array** containing **multiple advisory objects** (one for each fish species record found in that state).

### Output Format: Array of Advisory Objects

```json
[
  {
    "species": "Pampus argenteus",
    "latitude": 9.93,
    "longitude": 77.12,
    "zone": "Green",
    "risk_factors": [
      "High proportion of juveniles below legal size.",
      "Shallow waters (<30 m) increase juvenile aggregation.",
      "Model confidence for Green zone: 0.87"
    ],
    "fishing_advisory": "Low juvenile and disease risk. Suitable for fishing within sustainable catch limits and existing regulations.",
    "recommended_gear": "Standard gear allowed with compliance to mesh-size regulations and bycatch reduction devices.",
    "economic_note": "High value species in a permitted zone; optimize value through quality handling and market timing while keeping catches within sustainable limits.",
    "river_name": "Periyar"
  },
  {
    "species": "Tenualosa ilisha",
    "latitude": 10.92,
    "longitude": 88.42,
    "zone": "Red",
    "risk_factors": [
      "High proportion of juveniles below legal size.",
      "Brackish waters are typical juvenile nursery habitats.",
      "Seasonal disease reported: Tail Rot.",
      "Model confidence for Red zone: 0.92"
    ],
    "fishing_advisory": "High-risk juvenile nursery zone. Strongly advise temporary fishing closure or very limited, strictly monitored operations to protect juvenile stocks.",
    "recommended_gear": "Use highly selective gears such as hook-and-line or species/size-selective gillnets; avoid trawls and purse seines.",
    "economic_note": "High value species, but protection of juvenile stock in this high-risk zone is prioritized over short-term revenue.",
    "river_name": "Periyar"
  }
  // ... more species records for that state
]
```

---

## 📊 **OUTPUT FIELD EXPLANATIONS**

### Each Advisory Object Contains:

| Field | Type | Description |
|-------|------|-------------|
| **`species`** | string | Scientific name of the fish species (e.g., "Pampus argenteus") |
| **`latitude`** | float | GPS latitude coordinate of the fishing location |
| **`longitude`** | float | GPS longitude coordinate of the fishing location |
| **`zone`** | string | Risk zone classification: **"Green"**, **"Yellow"**, or **"Red"** |
| **`risk_factors`** | array of strings | List of reasons why this zone was assigned (e.g., shallow waters, high juvenile presence, disease risk) |
| **`fishing_advisory`** | string | Human-readable recommendation for fishing in this zone |
| **`recommended_gear`** | string | Specific gear type recommendations based on the zone |
| **`economic_note`** | string | Economic value context and harvesting strategy note |
| **`river_name`** | string | The river name you provided as input (attached to each record) |

---

## 🎨 **ZONE MEANINGS**

- **🟢 Green Zone**: Low risk, suitable for fishing with standard regulations
- **🟡 Yellow Zone**: Moderate risk, controlled fishing with gear restrictions
- **🔴 Red Zone**: High risk, strongly advise closure or very limited operations

---

## 💡 **WEBSITE DISPLAY SUGGESTIONS**

### Option 1: List View
- Show all species as cards/list items
- Color-code by zone (Green/Yellow/Red)
- Display species name, zone badge, and key risk factors
- Expandable details for full advisory

### Option 2: Map View
- Plot each species location using `latitude` and `longitude`
- Use zone colors for markers
- Click markers to show species details and advisory

### Option 3: Filtered View
- Group by zone (show all Red zones first, then Yellow, then Green)
- Allow filtering by zone or species name
- Show summary statistics (e.g., "5 Red zones, 12 Yellow zones, 30 Green zones")

---

## 🔌 **BACKEND INTEGRATION EXAMPLE**

When your website form is submitted, your backend should:

1. Receive: `{ "state": "Kerala", "river_name": "Periyar" }`
2. Call the ML pipeline (or import the function)
3. Return the JSON array to the frontend
4. Frontend displays the results

### Example Backend Code (Python/Flask):

```python
from ML.fish_advisory_pipeline import load_and_preprocess, train_zone_classifier, generate_advisories_for_state

# Load model once on startup (cache it)
X, y, pre, df_full = load_and_preprocess("path/to/indian_fish_dataset.csv")
model, _ = train_zone_classifier(X, y, pre)

@app.route('/api/advisory', methods=['POST'])
def get_advisory():
    data = request.json
    state = data['state']
    river_name = data['river_name']
    
    advisories = generate_advisories_for_state(
        model=model,
        full_df=df_full,
        state=state,
        river_name=river_name
    )
    
    return jsonify(advisories)
```

---

## 📝 **NOTES**

- The output contains **ALL fish species records** found in the specified state
- Each record represents a different species/location combination
- The `river_name` you provide is attached to every record (for display purposes)
- The model is trained to minimize false Green predictions in high-risk zones

