import os
import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler


DATA_FILE = "rfm_data.csv"

FEATURES = [
    "Recency",
    "Frequency",
    "Monetary"
]


# -----------------------------------------
# Load dataset
# -----------------------------------------

if not os.path.exists(DATA_FILE):
    raise FileNotFoundError(
        "rfm_data.csv not found. Run prepare_data.py first."
    )

data = pd.read_csv(DATA_FILE)


# -----------------------------------------
# Prepare features
# -----------------------------------------

features = data[FEATURES]


# -----------------------------------------
# Standardization
# -----------------------------------------

scaler = StandardScaler()

scaled_data = scaler.fit_transform(features)


# -----------------------------------------
# K-Means
# -----------------------------------------

kmeans = KMeans(
    n_clusters=3,
    random_state=42,
    n_init=10
)

data["Cluster"] = kmeans.fit_predict(
    scaled_data
)


# -----------------------------------------
# Give meaningful names
# -----------------------------------------

centers = kmeans.cluster_centers_

scores = (
    -centers[:, 0]
    + centers[:, 1]
    + centers[:, 2]
)

cluster_order = np.argsort(scores)[::-1]


cluster_names = {
    int(cluster_order[0]): "High Value Customer",
    int(cluster_order[1]): "Regular Customer",
    int(cluster_order[2]): "Low Value Customer"
}


data["Segment"] = data["Cluster"].map(
    cluster_names
)


# -----------------------------------------
# Prediction
# -----------------------------------------

def predict_segment(
    recency,
    frequency,
    monetary
):

    customer = np.array([
        [recency, frequency, monetary]
    ])

    customer_scaled = scaler.transform(
        customer
    )

    cluster = int(
        kmeans.predict(customer_scaled)[0]
    )

    return cluster_names[cluster]


# -----------------------------------------
# Dashboard data
# -----------------------------------------

def get_dashboard_data():

    total_customers = len(data)

    high_value = int(
        (data["Segment"] == "High Value Customer").sum()
    )

    regular = int(
        (data["Segment"] == "Regular Customer").sum()
    )

    low_value = int(
        (data["Segment"] == "Low Value Customer").sum()
    )

    return {

        "total_customers": total_customers,

        "segments": 3,

        "high_value": high_value,

        "regular": regular,

        "low_value": low_value,

        "average_recency": round(
            data["Recency"].mean(),
            2
        ),

        "average_frequency": round(
            data["Frequency"].mean(),
            2
        ),

        "average_monetary": round(
            data["Monetary"].mean(),
            2
        )
    }


# -----------------------------------------
# Customer explorer
# -----------------------------------------

def get_customers(
    segment="All",
    search=""
):

    result = data.copy()


    if segment != "All":

        result = result[
            result["Segment"] == segment
        ]


    if search:

        result = result[
            result["CustomerID"]
            .astype(str)
            .str.contains(
                search,
                case=False,
                na=False
            )
        ]


    result = result.sort_values(
        "Monetary",
        ascending=False
    )


    result = result.head(100)


    customers = []


    for _, row in result.iterrows():

        customers.append({

            "customer_id": str(
                row["CustomerID"]
            ),

            "recency": round(
                float(row["Recency"]),
                2
            ),

            "frequency": round(
                float(row["Frequency"]),
                2
            ),

            "monetary": round(
                float(row["Monetary"]),
                2
            ),

            "segment": row["Segment"]
        })


    return customers


# -----------------------------------------
# Model information
# -----------------------------------------

def get_model_info():

    return {

        "algorithm": "K-Means Clustering",

        "clusters": 3,

        "features": [
            "Recency",
            "Frequency",
            "Monetary"
        ],

        "scaling": "StandardScaler",

        "customers": len(data),

        "dataset": "UCI Online Retail",

        "transactions": 541909
    }
