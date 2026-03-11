# ───────────────────────────────────────────────
# Goal-Based Wealth Planning Engine
# ───────────────────────────────────────────────
# This engine simulates whether a user's monthly investments
# will be enough to reach a financial goal (like buying a house,
# retirement, or education) within a given number of years.
#
# It uses the Future Value of an Annuity formula with compound
# growth to project how much money the user will accumulate.


def simulate_goal(target_amount: float, years: int, monthly_investment: float):
    """
    Simulates whether the user can reach their financial goal.

    Parameters:
        target_amount       - the amount of money the user wants to save
        years               - how many years the user plans to invest
        monthly_investment  - how much the user will invest every month

    Returns a dict with:
        future_value                    - estimated money after 'years' of investing
        goal_status                     - "on_track" or "needs_more_savings"
        recommended_monthly_investment  - only included if user needs to save more
    """

    # ── Step 1: Define the assumed yearly return rate ──
    # We assume a 10% annual return (common benchmark for equity markets)
    yearly_return_rate = 0.10

    # Convert the yearly rate to a monthly rate
    # (divide by 12 because the user invests every month)
    monthly_return_rate = yearly_return_rate / 12

    # Total number of months the user will be investing
    total_months = years * 12

    # ── Step 2: Calculate the Future Value using compound growth ──
    # Formula:  FV = P × [((1 + r)^n - 1) / r]
    #   P = monthly investment
    #   r = monthly return rate
    #   n = total number of months
    #
    # This tells us how much money the user will have at the end.
    future_value = monthly_investment * (
        ((1 + monthly_return_rate) ** total_months - 1) / monthly_return_rate
    )

    # Round to 2 decimal places for cleaner output
    future_value = round(future_value, 2)

    # ── Step 3: Compare future value with the target ──
    if future_value >= target_amount:
        # The user is on track to meet their goal
        goal_status = "on_track"
    else:
        # The user needs to invest more each month
        goal_status = "needs_more_savings"

    # ── Step 4: Build the result dictionary ──
    result = {
        "future_value": future_value,
        "goal_status": goal_status,
    }

    # ── Step 5: If user is NOT on track, calculate how much they should invest ──
    # We rearrange the same formula to solve for P (monthly investment):
    #   P = target_amount × r / ((1 + r)^n - 1)
    if goal_status == "needs_more_savings":
        recommended = target_amount * (
            monthly_return_rate / ((1 + monthly_return_rate) ** total_months - 1)
        )
        result["recommended_monthly_investment"] = round(recommended, 2)

    return result
