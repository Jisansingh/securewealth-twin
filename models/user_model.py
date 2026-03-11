from pydantic import BaseModel

# This defines what a user looks like in our system
class User(BaseModel):
    name: str
    monthly_income: float
    monthly_expenses: float
    savings: float