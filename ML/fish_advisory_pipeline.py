import json
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional, Tuple

import argparse
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


JUVENILE_RANGE_COL = "juvenile_range_cm"


NON_SELECTIVE_GEARS = {"Trawl", "Purse Seine"}
MONSOON_SEASONS = {"Monsoon", "Post-Monsoon", "Post Monsoon"}


@dataclass
class AdvisoryOutput:
    species: str
    latitude: float
    longitude: float
    zone: str
    risk_factors: List[str]
    fishing_advisory: str
    recommended_gear: str
    economic_note: str

    def to_json(self) -> str:
        return json.dumps(asdict(self), ensure_ascii=False)


def _parse_juvenile_range(range_str: str) -> Tuple[Optional[float], Optional[float]]:
    if pd.isna(range_str):
        return None, None
    try:
        parts = str(range_str).split("-")
        if len(parts) != 2:
            return None, None
        min_v = float(parts[0])
        max_v = float(parts[1])
        return min_v, max_v
    except Exception:
        return None, None


def load_and_preprocess(
    csv_path: str,
) -> Tuple[pd.DataFrame, pd.Series, ColumnTransformer, pd.DataFrame]:
    df = pd.read_csv(csv_path)

    # Parse juvenile range
    juvenile_min, juvenile_max = zip(*df[JUVENILE_RANGE_COL].map(_parse_juvenile_range))
    df["juvenile_min_cm"] = juvenile_min
    df["juvenile_max_cm"] = juvenile_max

    # Juvenile dominance flag: True if juvenile_max_cm < min_legal_size_cm
    df["juvenile_dominance"] = (
        df["juvenile_max_cm"].astype(float) < df["min_legal_size_cm"].astype(float)
    )

    # Disease flag
    df["disease_risk"] = df["seasonal_disease"].notna()

    # Feature engineering for juvenile_risk_score
    df["is_shallow"] = df["depth_m"] < 30.0
    df["high_chl"] = df["chlorophyll_mg_m3"] > 2.0
    df["is_monsoonish"] = df["season"].isin(MONSOON_SEASONS)
    df["is_brackish"] = df["water_type"].str.lower().eq("brackish")
    df["non_selective_gear"] = df["gear_type"].isin(NON_SELECTIVE_GEARS)

    # Simple additive risk scoring (0–6)
    risk_components = [
        "juvenile_dominance",
        "is_shallow",
        "high_chl",
        "is_monsoonish",
        "is_brackish",
        "non_selective_gear",
    ]
    df["juvenile_risk_score"] = df[risk_components].astype(int).sum(axis=1)

    # Economic priority score: rank-based (0–1)
    df["economic_priority_score"] = (
        df["economic_value_in_INR_per_kg"].rank(method="max") / len(df)
    )

    # Target
    y = df["zone_label"]

    # Select features for ML
    numeric_features = [
        "sea_surface_temp_C",
        "chlorophyll_mg_m3",
        "depth_m",
        "min_legal_size_cm",
        "juvenile_min_cm",
        "juvenile_max_cm",
        "juvenile_risk_score",
        "economic_priority_score",
    ]
    categorical_features = ["state", "water_type", "season", "gear_type"]
    boolean_features = [
        "juvenile_dominance",
        "disease_risk",
        "is_shallow",
        "high_chl",
        "is_monsoonish",
        "is_brackish",
        "non_selective_gear",
    ]

    # Handle missing numeric values with water_type specific median
    for col in numeric_features:
        if df[col].isna().any():
            df[col] = df.groupby("water_type")[col].transform(
                lambda x: x.fillna(x.median())
            )

    # For booleans, fill missing with False
    for col in boolean_features:
        if df[col].isna().any():
            df[col] = df[col].fillna(False)

    # For categoricals, fill missing with explicit unknown token
    for col in categorical_features:
        if df[col].isna().any():
            df[col] = df[col].fillna("Unknown")

    X = df[numeric_features + categorical_features + boolean_features].copy()

    # Column transformer for ML
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore"),
                categorical_features,
            ),
            # Booleans go through as-is
            ("bool", "passthrough", boolean_features),
        ]
    )

    return X, y, preprocessor, df


def train_zone_classifier(
    X: pd.DataFrame,
    y: pd.Series,
    preprocessor: ColumnTransformer,
    random_state: int = 42,
) -> Tuple[Pipeline, Dict[str, Any]]:
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        stratify=y,
        random_state=random_state,
    )

    # RandomForest classifier with higher cost for misclassifying Red/Yellow as Green
    class_weights = {"Green": 1.0, "Yellow": 2.0, "Red": 3.0}

    clf = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight=class_weights,
        random_state=random_state,
        n_jobs=-1,
    )

    model = Pipeline(
        steps=[
            ("pre", preprocessor),
            ("clf", clf),
        ]
    )

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    cm = confusion_matrix(y_test, y_pred, labels=["Green", "Yellow", "Red"])

    eval_results = {
        "accuracy": acc,
        "classification_report": report,
        "confusion_matrix": cm.tolist(),
        "labels": ["Green", "Yellow", "Red"],
    }

    return model, eval_results


def _juvenile_risk_probability(row: pd.Series) -> float:
    # Map score (0–6) into 0–1 probability
    max_score = 6.0
    return float(np.clip(row["juvenile_risk_score"] / max_score, 0.0, 1.0))


def _derive_risk_factors(row: pd.Series, zone: str) -> List[str]:
    reasons: List[str] = []
    if row.get("juvenile_dominance", False):
        reasons.append("High proportion of juveniles below legal size.")
    if row.get("is_shallow", False):
        reasons.append("Shallow waters (<30 m) increase juvenile aggregation.")
    if row.get("high_chl", False):
        reasons.append("High chlorophyll (>2 mg/m³) indicates productive nursery-like waters.")
    if row.get("is_monsoonish", False):
        reasons.append("Monsoon/post-monsoon season associated with spawning and recruitment.")
    if row.get("is_brackish", False):
        reasons.append("Brackish waters are typical juvenile nursery habitats.")
    if row.get("non_selective_gear", False):
        reasons.append("Non-selective gear (trawl/purse seine) increases juvenile bycatch.")
    if row.get("disease_risk", False):
        reasons.append(f"Seasonal disease reported: {row.get('seasonal_disease')}.")

    if not reasons and zone == "Green":
        reasons.append("Low observed juvenile risk and no major disease indicators.")

    return reasons


def _recommend_gear(row: pd.Series, zone: str) -> str:
    if zone == "Red":
        return "Use highly selective gears such as hook-and-line or species/size-selective gillnets; avoid trawls and purse seines."
    if zone == "Yellow":
        return "Prefer selective gears (hook-and-line, selective gillnets); restrict trawls/purse seines or operate with larger mesh sizes."
    # Green
    return "Standard gear allowed with compliance to mesh-size regulations and bycatch reduction devices."


def _advisory_text(zone: str, juvenile_prob: float) -> str:
    if zone == "Red":
        return (
            "High-risk juvenile nursery zone. Strongly advise temporary fishing closure or "
            "very limited, strictly monitored operations to protect juvenile stocks."
        )
    if zone == "Yellow":
        if juvenile_prob > 0.6:
            return (
                "Moderate-to-high juvenile presence. Allow only regulated, low-intensity fishing "
                "with strict gear controls and size-based release of undersized catch."
            )
        return (
            "Transitional risk zone. Permit controlled fishing with mandatory size monitoring "
            "and seasonal effort caps."
        )
    # Green
    if juvenile_prob > 0.5:
        return (
            "Generally suitable for fishing but with noticeable juvenile presence; enforce "
            "minimum legal sizes and encourage release of undersized individuals."
        )
    return (
        "Low juvenile and disease risk. Suitable for fishing within sustainable catch limits "
        "and existing regulations."
    )


def _economic_note(economic_value: float, zone: str) -> str:
    if economic_value >= 700:
        value_band = "very high"
    elif economic_value >= 500:
        value_band = "high"
    elif economic_value >= 300:
        value_band = "moderate"
    else:
        value_band = "low"

    if zone == "Red":
        return (
            f"Species has {value_band} economic value, but protection of juvenile stock in this "
            "high-risk zone is prioritized over short-term revenue."
        )
    if zone == "Yellow":
        return (
            f"{value_band.capitalize()} value species in a caution zone; adopt conservative effort "
            "and value-added processing rather than volume-based harvest."
        )
    return (
        f"{value_band.capitalize()} value species in a permitted zone; optimize value through "
        "quality handling and market timing while keeping catches within sustainable limits."
    )


def generate_advisory_json(
    model: Pipeline,
    full_df: pd.DataFrame,
    row_index: int,
) -> Dict[str, Any]:
    row = full_df.iloc[row_index]

    # Rebuild feature row in the same way as training
    feature_cols = [
        "sea_surface_temp_C",
        "chlorophyll_mg_m3",
        "depth_m",
        "min_legal_size_cm",
        "juvenile_min_cm",
        "juvenile_max_cm",
        "juvenile_risk_score",
        "economic_priority_score",
        "state",
        "water_type",
        "season",
        "gear_type",
        "juvenile_dominance",
        "disease_risk",
        "is_shallow",
        "high_chl",
        "is_monsoonish",
        "is_brackish",
        "non_selective_gear",
    ]
    X_row = row[feature_cols].to_frame().T

    zone_pred = model.predict(X_row)[0]
    proba = model.predict_proba(X_row)[0]
    class_index = list(model.named_steps["clf"].classes_).index(zone_pred)
    zone_confidence = float(proba[class_index])

    juvenile_prob = _juvenile_risk_probability(row)
    risk_factors = _derive_risk_factors(row, zone_pred)
    advisory = _advisory_text(zone_pred, juvenile_prob)
    gear_rec = _recommend_gear(row, zone_pred)
    econ_note = _economic_note(row["economic_value_in_INR_per_kg"], zone_pred)

    output = AdvisoryOutput(
        species=row["scientific_name"],
        latitude=float(row["latitude"]),
        longitude=float(row["longitude"]),
        zone=zone_pred,
        risk_factors=risk_factors
        + [f"Model confidence for {zone_pred} zone: {zone_confidence:.2f}"],
        fishing_advisory=advisory,
        recommended_gear=gear_rec,
        economic_note=econ_note,
    )
    return asdict(output)


def generate_advisories_for_state(
    model: Pipeline,
    full_df: pd.DataFrame,
    state: str,
    river_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Filter records by state (and optionally brackish water to approximate river/estuary),
    then return advisory JSON for each matching row.

    Note: current dataset does not contain an explicit river column, so `river_name`
    is used only as a label for your frontend, not as a filter.
    """
    mask = full_df["state"].str.lower() == state.lower()
    # For river contexts, you may typically care about brackish / estuarine points
    subset = full_df[mask].reset_index(drop=True)

    advisories: List[Dict[str, Any]] = []
    for i in range(len(subset)):
        # Use the subset but keep logic identical
        row_json = generate_advisory_json(model, subset, i)
        if river_name:
            # You can attach river_name into the JSON for your API if needed
            row_json["river_name"] = river_name
        advisories.append(row_json)
    return advisories


def main():
    parser = argparse.ArgumentParser(
        description="Species-wise juvenile fish density and advisory generator"
    )
    parser.add_argument(
        "--data-path",
        type=str,
        default=r"c:\Users\Divyansh Saxena\Desktop\indian_fish_dataset.csv",
        help="Path to the fisheries CSV dataset.",
    )
    parser.add_argument(
        "--state",
        type=str,
        required=True,
        help="Indian coastal state to query (e.g., 'Kerala').",
    )
    parser.add_argument(
        "--river-name",
        type=str,
        required=False,
        help="Optional river/estuary name label for the query.",
    )

    args = parser.parse_args()

    X, y, pre, df_full = load_and_preprocess(args.data_path)
    model, eval_results = train_zone_classifier(X, y, pre)

    # Print basic evaluation summary (you can remove this in production)
    print(f"Model accuracy: {eval_results['accuracy']:.3f}")

    advisories = generate_advisories_for_state(
        model=model,
        full_df=df_full,
        state=args.state,
        river_name=args.river_name,
    )

    # API-ready JSON list of objects
    print(json.dumps(advisories, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()


