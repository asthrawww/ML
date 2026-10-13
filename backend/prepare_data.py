from ucimlrepo import fetch_ucirepo
import pandas as pd


print("Downloading Online Retail dataset...")


# Get UCI dataset
online_retail = fetch_ucirepo(id=352)


# Use original data
df = online_retail.data.original.copy()


print("Dataset downloaded successfully!")

print("Rows:", len(df))

print("Columns:", list(df.columns))


# Remove customers without CustomerID
df = df.dropna(
    subset=["CustomerID"]
)


# Remove cancelled invoices
df = df[
    ~df["InvoiceNo"]
    .astype(str)
    .str.upper()
    .str.startswith("C")
]


# Convert date
df["InvoiceDate"] = pd.to_datetime(
    df["InvoiceDate"]
)


# Calculate total transaction value
df["TotalPrice"] = (
    df["Quantity"] *
    df["UnitPrice"]
)


# Reference date
snapshot_date = (
    df["InvoiceDate"].max()
    + pd.Timedelta(days=1)
)


# -----------------------------------------
# RFM calculation
# -----------------------------------------

rfm = df.groupby(
    "CustomerID"
).agg(

    Recency=(
        "InvoiceDate",
        lambda x:
        (snapshot_date - x.max()).days
    ),

    Frequency=(
        "InvoiceNo",
        "nunique"
    ),

    Monetary=(
        "TotalPrice",
        "sum"
    )

).reset_index()


# Keep valid customers
rfm = rfm[
    (rfm["Monetary"] > 0)
    &
    (rfm["Frequency"] > 0)
]


# Save
rfm.to_csv(
    "rfm_data.csv",
    index=False
)


print()
print(
    "RFM dataset created successfully!"
)

print(
    "Number of customers:",
    len(rfm)
)

print()
print(rfm.head())
