# ───────────────────────────────────────────────
# Goal-Based Wealth Planning Routes
# ───────────────────────────────────────────────
# This file defines the API endpoints related to
# goal-based financial planning and simulation.

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.goal_engine import simulate_goal
from routes.transaction_routes import get_current_user

router = APIRouter()

class GoalSimulationRequest(BaseModel):
    user_name: str
    goal_name: str
    target_amount: float
    years: int
    monthly_investment: float

@router.post("/goal-simulation")
def goal_simulation(
    payload: GoalSimulationRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Simulates whether a user's monthly investment plan
    will be enough to reach a specific financial goal.

    Example goals: "retirement", "house", "education"
    """

    # Step 1: Call the goal engine to run the simulation
    result = simulate_goal(payload.target_amount, payload.years, payload.monthly_investment)

    # Step 2: Build the response with user and goal context
    response = {
        "user": payload.user_name,
        "goal": payload.goal_name,
        "target_amount": payload.target_amount,
        "years": payload.years,
        "monthly_investment": payload.monthly_investment,
        "future_value": result["future_value"],
        "goal_status": result["goal_status"],
    }

    # Step 3: Include the recommended amount only if the user needs to save more
    if "recommended_monthly_investment" in result:
        response["recommended_monthly_investment"] = result["recommended_monthly_investment"]

    return response

