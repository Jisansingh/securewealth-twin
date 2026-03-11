# ───────────────────────────────────────────────
# Audit Logger Service
# ───────────────────────────────────────────────
# This module keeps a simple in-memory list of audit logs.
# Every important action (like an investment attempt) is
# recorded here so we can review it later via the API.
#
# NOTE: Since we use an in-memory list, the logs will be
# cleared whenever the server restarts. For a real project,
# you would save these to a database instead.

from datetime import datetime


# ── In-memory storage for audit logs ──
# This list will hold all the log entries as dictionaries.
audit_logs = []


def log_action(user: str, action: str, amount: float, risk_score: int, decision: str):
    """
    Records an action into the audit log.

    Parameters:
        user        - name of the user who performed the action
        action      - what the user tried to do (e.g. "simulate-investment")
        amount      - the monetary amount involved (can be 0 if not applicable)
        risk_score  - the fraud risk score calculated for this action
        decision    - the fraud engine's decision (ALLOW / WARN / BLOCK)
    """

    # Create a log entry as a simple dictionary
    log_entry = {
        "user": user,
        "action": action,
        "amount": amount,
        "risk_score": risk_score,
        "decision": decision,
        "timestamp": datetime.now().isoformat()  # current date & time as a string
    }

    # Append the entry to our in-memory list
    audit_logs.append(log_entry)


def get_logs():
    """
    Returns all the audit logs collected so far.
    """
    return audit_logs
