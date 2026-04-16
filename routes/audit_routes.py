# ───────────────────────────────────────────────
# Audit Log Routes
# ───────────────────────────────────────────────
# This file provides an API endpoint to view all
# the audit logs that have been recorded so far.

from fastapi import APIRouter, Depends
from services.audit_logger import get_logs
from routes.transaction_routes import get_current_user

router = APIRouter()


@router.get("/audit-logs")
def audit_logs(current_user: dict = Depends(get_current_user)):
    """
    Returns all recorded audit logs.

    Each log entry contains:
        user        - who performed the action
        action      - what they tried to do
        amount      - the monetary amount involved
        risk_score  - the calculated fraud risk score
        decision    - ALLOW / WARN / BLOCK
        timestamp   - when the action happened
    """

    # Fetch all logs from the audit logger service
    logs = get_logs()

    return {
        "total_logs": len(logs),
        "logs": logs
    }

