"""
SecureWealth Twin — FastAPI Application
========================================
Production-ready fintech backend with integrated cyber-risk scoring engine.

Run with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import user_routes, wealth_routes, transaction_routes, goal_routes, audit_routes
from routes import risk  # ← new risk engine routes

# ── App initialisation ──────────────────────────

app = FastAPI(
    title="SecureWealth Twin",
    description=(
        "Fintech backend that protects financial actions using a "
        "cyber-risk scoring engine with full explainability."
    ),
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health check ────────────────────────────────

@app.get("/", tags=["Health"])
def read_root():
    return {
        "app": "SecureWealth Twin",
        "status": "running",
        "version": "1.0.0",
    }

# ── Register routers ───────────────────────────

app.include_router(user_routes.router)
app.include_router(wealth_routes.router)
app.include_router(transaction_routes.router)
app.include_router(goal_routes.router)
app.include_router(audit_routes.router)
app.include_router(risk.router)         # ← risk-check & wealth-action