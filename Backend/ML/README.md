## ML Pipelines

This folder contains all machine learning–related code for the project.

- `fish_advisory_pipeline.py`: End-to-end pipeline for
  - loading and preprocessing the Indian fisheries dataset,
  - engineering juvenile risk and economic features,
  - training a Random Forest classifier on `zone_label` (Green/Yellow/Red),
  - generating species-wise juvenile risk advisories in an API-ready JSON format.
- `requirements.txt`: Minimal Python dependencies required to run the ML pipeline.

### How to run the advisory generator

From the project root:

```bash
pip install -r ML/requirements.txt
python ML/fish_advisory_pipeline.py --state "Kerala" --river-name "Periyar"
```

The script will prnt:

- a brief model accuracy summary, and  
- a JSON array of advisory objects, each containing:
  `species`, `latitude`, `longitude`, `zone`, `risk_factors`, `fishing_advisory`, `recommended_gear`, `economic_note`, and optional `river_name`.


