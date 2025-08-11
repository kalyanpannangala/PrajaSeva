def calculate_corpus(current_savings, monthly_investment, annual_return_rate, years):
    """
    Calculate future corpus using SIP formula.
    """
    corpus = current_savings
    for _ in range(years):
        annual_investment = monthly_investment * 12
        corpus += annual_investment
        corpus += corpus * (annual_return_rate / 100)
    return corpus

def adjust_for_inflation(amount, inflation_rate, years):
    """
    Adjusts a future value for inflation using FV / (1 + rate)^years.
    """
    return amount / ((1 + inflation_rate / 100) ** years)
