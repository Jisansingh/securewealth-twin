"""
SecureWealth Twin — Risk & Wealth-Action Routes
=================================================
Endpoints:
    POST /risk-check     — Evaluate a financial action for fraud risk
    POST /wealth-action  — Perform a financial action with built-in risk gating
    GET  /risk-logs      — Retrieve risk event audit trail
"""

from __future__ import annotations

from fastapi import APIRouter, Query
from typing import Optional

from models.schemas import (
    RiskCheckRequest,
    RiskCheckResponse,
    WealthActionRequest,
    WealthActionResponse,
)
from services.risk_engine import evaluate_risk
from utils.logger import log_risk_event, get_risk_events

router = APIRouter(tags=["Risk Engine"])


# ─────────────────────────────────────────────────
# POST /risk-check
# ─────────────────────────────────────────────────

@router.post(
    "/risk-check",
    response_model=RiskCheckResponse,
    summary="Evaluate fraud risk for a financial action",
    description=(
        "Accepts transaction context and returns a risk score, "
        "decision (allow / warn / block), and human-readable reasons."
    ),
)
def risk_check(payload: RiskCheckRequest) -> RiskCheckResponse:
    # 1. Run the risk engine
    result = evaluate_risk(payload)

    # 2. Log the event
    log_risk_event(
        user_id=payload.user_id,
        risk_score=result.risk_score,
        decision=result.decision,
        action="risk-check",
        amount=payload.amount,
        reasons=result.reasons,
    )

    return result


# ─────────────────────────────────────────────────
# POST /wealth-action
# ─────────────────────────────────────────────────

@router.post(
    "/wealth-action",
    response_model=WealthActionResponse,
    summary="Execute a financial action with risk gating",
    description=(
        "Internally calls the risk engine. "
        "If blocked → reject. If warned → return caution. If allowed → simulate success."
    ),
)
def wealth_action(payload: WealthActionRequest) -> WealthActionResponse:
    # Build a RiskCheckRequest from the wealth-action payload
    risk_request = RiskCheckRequest(
        user_id=payload.user_id,
        amount=payload.amount,
        is_new_device=payload.is_new_device,
        otp_retries=payload.otp_retries,
        fast_action=payload.fast_action,
    )

    # Run the risk engine
    result = evaluate_risk(risk_request)

    # Map decision → status & message
    if result.decision == "block":
        status = "rejected"
        message = (
            f"🚫 Action BLOCKED — risk score {result.risk_score}/100. "
            "Transaction rejected due to high fraud indicators."
        )
    elif result.decision == "warn":
        status = "warning"
        message = (
            f"⚠️ Caution — risk score {result.risk_score}/100. "
            "Proceed with additional verification."
        )
    else:
        status = "success"
        message = (
            f"✅ Action APPROVED — risk score {result.risk_score}/100. "
            f"{payload.action_type.capitalize()} of ₹{payload.amount:,.2f} simulated successfully."
        )

    # Log the event
    log_risk_event(
        user_id=payload.user_id,
        risk_score=result.risk_score,
        decision=result.decision,
        action=payload.action_type,
        amount=payload.amount,
        reasons=result.reasons,
    )

    return WealthActionResponse(
        user_id=payload.user_id,
        action_type=payload.action_type,
        amount=payload.amount,
        risk_score=result.risk_score,
        decision=result.decision,
        reasons=result.reasons,
        status=status,
        message=message,
    )


# ─────────────────────────────────────────────────
# GET /risk-logs
# ─────────────────────────────────────────────────

@router.get(
    "/risk-logs",
    summary="Retrieve risk event audit trail",
    description="Returns logged risk events, optionally filtered by user_id.",
)
def risk_logs(
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    limit: int = Query(50, ge=1, le=500, description="Max events to return"),
):
    return get_risk_events(user_id=user_id, limit=limit)
