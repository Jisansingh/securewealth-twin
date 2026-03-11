def calculate_risk(new_device: bool, large_amount: bool, otp_retry: bool):

    risk_score = 0

    # rule 1: new device
    if new_device:
        risk_score += 30

    # rule 2: unusually large transaction
    if large_amount:
        risk_score += 40

    # rule 3: multiple OTP attempts
    if otp_retry:
        risk_score += 20

    # decision logic
    if risk_score < 30:
        decision = "ALLOW"
        explanation = "Transaction looks safe."

    elif 30 <= risk_score <= 60:
        decision = "WARN"
        explanation = "This action looks unusual. Please verify."

    else:
        decision = "BLOCK"
        explanation = "High fraud risk detected."

    return {
        "risk_score": risk_score,
        "decision": decision,
        "explanation": explanation
    }