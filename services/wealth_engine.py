def analyze_finances(income, expenses):

    # calculate savings
    savings = income - expenses

    # calculate savings rate
    savings_rate = savings / income

    # simple financial advice
    if savings_rate < 0.2:
        advice = "Your savings rate is low. Try saving at least 20% of your income."
    else:
        advice = "Your savings rate looks healthy."

    return {
        "income": income,
        "expenses": expenses,
        "savings_rate": round(savings_rate, 2),
        "advice": advice
    }