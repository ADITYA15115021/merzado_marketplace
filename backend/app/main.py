from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, rfqs, quotations


app = FastAPI(
    title="Mini B2B RFQ Marketplace",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://merzado-marketplace.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(rfqs.router)
app.include_router(quotations.router)


@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    return {"status": "ok"}