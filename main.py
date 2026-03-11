from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user_routes, wealth_routes, transaction_routes, goal_routes, audit_routes

app = FastAPI(title="SecureWealth Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(user_routes.router)
app.include_router(wealth_routes.router)
app.include_router(transaction_routes.router)
app.include_router(goal_routes.router)
app.include_router(audit_routes.router)