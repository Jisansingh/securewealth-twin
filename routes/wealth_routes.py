from fastapi import APIRouter
from services.wealth_engine import analyze_finances

router = APIRouter()

@router.get("/wealth-analysis")
def wealth_analysis(income: float, expenses: float):

    result = analyze_finances(income, expenses)

    return result