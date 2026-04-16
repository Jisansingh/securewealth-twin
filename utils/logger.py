"""
SecureWealth Twin — Risk Event Logger
======================================
Thread-safe, in-memory audit log for all risk evaluation events.
Also writes to a rotating log file for persistence across restarts.
"""

from __future__ import annotations

import json
import logging
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ── Python logging setup ────────────────────────

LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

_file_logger = logging.getLogger("securewealth.risk")
_file_logger.setLevel(logging.INFO)

_handler = logging.FileHandler(LOG_DIR / "risk_events.log", encoding="utf-8")
_handler.setFormatter(logging.Formatter("%(asctime)s | %(message)s"))
_file_logger.addHandler(_handler)


# ── In-memory store ─────────────────────────────

_lock = threading.Lock()
_risk_events: list[dict] = []


def log_risk_event(
    user_id: str,
    risk_score: int,
    decision: str,
    *,
    action: str = "",
    amount: float = 0.0,
    reasons: Optional[list[str]] = None,
) -> dict:
    """
    Record a risk event.

    Parameters
    ----------
    user_id : str
        The user who triggered the risk check.
    risk_score : int
        The computed risk score.
    decision : str
        Engine decision — allow / warn / block.
    action : str, optional
        The type of financial action (e.g. "invest").
    amount : float, optional
        Transaction amount.
    reasons : list[str], optional
        List of human-readable risk reasons.

    Returns
    -------
    dict
        The created log entry.
    """
    entry = {
        "user_id": user_id,
        "risk_score": risk_score,
        "decision": decision,
        "action": action,
        "amount": amount,
        "reasons": reasons or [],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    with _lock:
        _risk_events.append(entry)

    # Persist to file
    _file_logger.info(json.dumps(entry, default=str))

    return entry


def get_risk_events(
    user_id: Optional[str] = None,
    limit: int = 100,
) -> list[dict]:
    """
    Retrieve risk events, optionally filtered by user.

    Parameters
    ----------
    user_id : str, optional
        If provided, only return events for this user.
    limit : int
        Maximum number of events to return (most recent first).

    Returns
    -------
    list[dict]
    """
    with _lock:
        events = list(reversed(_risk_events))  # newest first

    if user_id:
        events = [e for e in events if e["user_id"] == user_id]

    return events[:limit]


def clear_risk_events() -> int:
    """Clear all in-memory risk events. Returns count deleted."""
    with _lock:
        count = len(_risk_events)
        _risk_events.clear()
    return count
