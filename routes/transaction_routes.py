from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from services.fraud_engine import calculate_risk
from services.audit_logger import log_action
from services.auth_service import decode_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

class InvestmentSimulationRequest(BaseModel):
    user_name: str
    investment_amount: float
    new_device: bool
    otp_retry: bool

@router.post("/transaction-check")
def transaction_check(
    new_device: bool,
    large_amount: bool,
    otp_retry: bool
):

    result = calculate_risk(new_device, large_amount, otp_retry)

    return result


# ───────────────────────────────────────────────
# NEW FEATURE: Transaction Simulation Engine
# ───────────────────────────────────────────────
# This endpoint simulates a user trying to invest money.
# It checks the investment amount, runs the fraud engine,
# and returns whether the investment is approved or blocked.

@router.post("/simulate-investment")
def simulate_investment(
    payload: InvestmentSimulationRequest,
    current_user: dict = Depends(get_current_user)
):

    # Step 1: Check if the investment amount is unusually large
    # For this demo, anything above 100,000 is considered "large"
    large_amount = payload.investment_amount > 100000

    # Step 2: Call the existing fraud engine to calculate risk
    risk_result = calculate_risk(payload.new_device, large_amount, payload.otp_retry)

    # Step 3: Map the fraud decision to an investment status & message
    decision = risk_result["decision"]

    if decision == "ALLOW":
        investment_status = "approved"
        message = "Investment approved."

    elif decision == "WARN":
        investment_status = "flagged"
        message = "Investment flagged. Please review before proceeding."

    else:  # decision == "BLOCK"
        investment_status = "blocked"
        message = "Investment blocked due to high fraud risk."

    # Step 4: Log this investment attempt for auditing
    # This records who tried to invest, how much, and what the fraud engine decided.
    log_action(
        user=payload.user_name,
        action="simulate-investment",
        amount=payload.investment_amount,
        risk_score=risk_result["risk_score"],
        decision=decision
    )

    # Step 5: Build and return the final response
    return {
        "user": payload.user_name,
        "investment_amount": payload.investment_amount,
        "risk_score": risk_result["risk_score"],
        "decision": decision,
        "explanation": risk_result["explanation"],
        "investment_status": investment_status,
        "message": message
    }