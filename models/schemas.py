"""
SecureWealth Twin — Pydantic Schemas
====================================
Central schema definitions for all request / response payloads.
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Literal


# ── Risk-Check ──────────────────────────────────

class RiskCheckRequest(BaseModel):
    """Payload sent by the client to evaluate fraud risk."""
    user_id: str = Field(..., min_length=1, description="Unique user identifier")
    amount: float = Field(..., gt=0, description="Transaction amount in INR")
    is_new_device: bool = Field(False, description="Whether the action originates from an unrecognised device")
    otp_retries: int = Field(0, ge=0, description="Number of OTP retry attempts")
    fast_action: bool = Field(False, description="Whether the action was performed unusually fast")


class RiskCheckResponse(BaseModel):
    """Result returned after risk evaluation."""
    risk_score: int = Field(..., ge=0, le=100, description="Computed risk score (0-100)")
    decision: Literal["allow", "warn", "block"] = Field(..., description="Engine decision")
    reasons: list[str] = Field(default_factory=list, description="Human-readable explanations")


# ── Wealth Action ───────────────────────────────

class WealthActionRequest(BaseModel):
    """Request to perform a financial action (invest, transfer, etc.)."""
    user_id: str = Field(..., min_length=1)
    action_type: str = Field(..., min_length=1, description="e.g. invest, transfer, withdraw")
    amount: float = Field(..., gt=0)
    is_new_device: bool = False
    otp_retries: int = Field(0, ge=0)
    fast_action: bool = False


class WealthActionResponse(BaseModel):
    """Outcome of a wealth action request."""
    user_id: str
    action_type: str
    amount: float
    risk_score: int
    decision: Literal["allow", "warn", "block"]
    reasons: list[str]
    status: Literal["success", "warning", "rejected"]
    message: str


# ── Risk Event Log ──────────────────────────────

class RiskEventLog(BaseModel):
    """Schema for a single risk-event audit entry."""
    user_id: str
    risk_score: int
    decision: str
    timestamp: str
    action: str = ""
    amount: float = 0.0
