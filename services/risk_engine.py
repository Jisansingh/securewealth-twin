"""
SecureWealth Twin — Cyber-Risk Scoring Engine
===============================================
Rule-based risk evaluator with full explainability.

Scoring Rules
─────────────
  • New device detected          → +20
  • Transaction amount > 100,000 → +30
  • OTP retries > 2              → +15
  • Fast / automated action      → +10

Decision Thresholds
───────────────────
  •  0–30  → allow
  • 31–60  → warn
  • >60    → block
"""

from __future__ import annotations

from models.schemas import RiskCheckRequest, RiskCheckResponse


def evaluate_risk(request: RiskCheckRequest) -> RiskCheckResponse:
    """
    Evaluate a financial action and return a risk assessment.

    Parameters
    ----------
    request : RiskCheckRequest
        Validated request payload.

    Returns
    -------
    RiskCheckResponse
        Contains risk_score, decision, and human-readable reasons.
    """
    risk_score: int = 0
    reasons: list[str] = []

    # ── Rule 1: New device ──────────────────────
    if request.is_new_device:
        risk_score += 20
        reasons.append("New device detected")

    # ── Rule 2: High transaction amount ─────────
    if request.amount > 100_000:
        risk_score += 30
        reasons.append(f"High transaction amount (₹{request.amount:,.2f})")

    # ── Rule 3: Multiple OTP retries ────────────
    if request.otp_retries > 2:
        risk_score += 15
        reasons.append(f"Multiple OTP retries ({request.otp_retries} attempts)")

    # ── Rule 4: Unusually fast action ───────────
    if request.fast_action:
        risk_score += 10
        reasons.append("Unusually fast action — possible automation")

    # ── Decision ────────────────────────────────
    if risk_score <= 30:
        decision = "allow"
    elif risk_score <= 60:
        decision = "warn"
    else:
        decision = "block"

    return RiskCheckResponse(
        risk_score=risk_score,
        decision=decision,
        reasons=reasons,
    )
