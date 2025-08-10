# tax_utils.py

def tax_from_slabs(taxable, slabs):
    tax = 0.0
    for low, high, rate in slabs:
        if taxable <= low:
            break
        upper = min(taxable, high)
        taxable_amount = max(0, upper - low)
        tax += taxable_amount * rate
    return tax


# -------------------------------
# Old Regime – FY 2024–25
# -------------------------------
old_slabs = [
    (0, 250000, 0.0),
    (250000, 500000, 0.05),
    (500000, 1000000, 0.20),
    (1000000, 50000000, 0.30),
    (50000000, float("inf"), 0.30),
]


def compute_tax_old(taxable_income):
    """
    Old Regime (FY 2024–25 rules)
    """
    tax = tax_from_slabs(taxable_income, old_slabs)

    # Rebate u/s 87A for income <= ₹5L
    rebate = 0.0
    if taxable_income <= 500000:
        rebate = min(12500, tax)

    tax = max(0.0, tax - rebate)
    tax *= 1.04  # 4% cess
    return round(tax, 2)


# -------------------------------
# New Regime – FY 2025–26 (Budget 2025 changes)
# - No tax up to ₹12,00,000
# - Salaried: additional ₹75,000 standard deduction → ₹12,75,000
# -------------------------------
new_slabs = [
    (0, 400000, 0.0),
    (400000, 800000, 0.05),
    (800000, 1200000, 0.10),
    (1200000, 1600000, 0.15),
    (1600000, 2000000, 0.20),
    (2000000, 2400000, 0.25),
    (2400000, float("inf"), 0.30),
]


def compute_tax_new(taxable_income, is_salaried=True):
    """
    New Regime (FY 2025–26 rules)
    - ₹12,00,000 exemption for all
    - ₹12,75,000 exemption for salaried
    """
    exemption_limit = 1200000
    if is_salaried:
        exemption_limit += 75000  # Standard deduction

    if taxable_income <= exemption_limit:
        return 0.0

    tax = tax_from_slabs(taxable_income, new_slabs)
    tax *= 1.04  # 4% cess
    return round(tax, 2)


# -------------------------------
# Compare Regimes
# -------------------------------
def compare_tax_regimes(gross_income, deductions_old=0, is_salaried=True):
    """
    Compare tax payable under old and new regimes.

    gross_income   : total annual income before deductions
    deductions_old : deductions allowed in old regime (80C, 80D, interest, etc.)
    is_salaried    : True if salaried (affects new regime exemption)
    """
    # Old regime taxable income
    taxable_old = max(0, gross_income - deductions_old)
    tax_old = compute_tax_old(taxable_old)

    # New regime taxable income (no extra deductions except std deduction)
    tax_new = compute_tax_new(gross_income, is_salaried)

    if tax_old < tax_new:
        better = "Old Regime (FY 2024–25)"
        savings = tax_new - tax_old
    elif tax_new < tax_old:
        better = "New Regime (FY 2025–26)"
        savings = tax_old - tax_new
    else:
        better = "Either regime (same tax)"
        savings = 0.0

    return {
        "old_regime_tax": tax_old,
        "new_regime_tax": tax_new,
        "better_regime": better,
        "savings": round(savings, 2)
    }
