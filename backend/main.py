from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import (
    predict_segment,
    get_dashboard_data,
    get_customers,
    get_model_info
)

app = FastAPI(title="Customer Segmentation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Customer(BaseModel):
    recency: float
    frequency: float
    monetary: float


@app.get("/")
def home():
    return {
        "message": "Customer Segmentation API is running"
    }


@app.get("/dashboard")
def dashboard():
    return get_dashboard_data()


@app.get("/customers")
def customers(
    segment: str = "All",
    search: str = ""
):
    return get_customers(segment, search)


@app.get("/model-info")
def model_info():
    return get_model_info()


@app.post("/predict")
def predict(customer: Customer):

    segment = predict_segment(
        customer.recency,
        customer.frequency,
        customer.monetary
    )

    return {
        "recency": customer.recency,
        "frequency": customer.frequency,
        "monetary": customer.monetary,
        "segment": segment
    }
