# tax_utils.py
"""
Tax calculation utilities for PrajaSeva tax module.

- Old Regime (FY 2024–25):
  * Standard deduction = ₹50,000
  * Full deductions allowed: 80C, 80D, 80E, home loan interest, etc.
  * Slabs: 0–2.5L:0%, 2.5–5L:5%, 5–10L:20%, 10L+:30%
  * Section 87A rebate: taxable income ≤ ₹5,00,000 → rebate up to ₹12,500
  * Cess = 4%

- New Regime (FY 2025–26):
  * Standard deduction = ₹75,000 (salaried), else ₹0
  * No other deductions
  * Slabs: 0–4L:0%, 4–8L:5%, 8–12L:10%, 12–16L:15%, 16–20L:20%, 20–24L:25%, 24L+:30%
  * Section 87A rebate: taxable income ≤ ₹12,00,000 → rebate (up to ₹60,000)
  * Cess = 4%
"""

from typing import Tuple

# -------------------------------
# Utility to compute tax by slab
# -------------------------------
def tax_from_slabs(taxable: float, slabs: list) -> float:
    tax = 0.0
    for low, high, rate in slabs:
        if taxable <= low:
            break
        upper = min(taxable, high)
        taxable_amount = max(0.0, upper - low)
        tax += taxable_amount * rate
    return tax

# -------------------------------
# Old Regime Slabs (FY 2024–25)
# -------------------------------
old_slabs = [
    (0, 250000, 0.0),
    (250000, 500000, 0.05),
    (500000, 1000000, 0.20),
    (1000000, float("inf"), 0.30),
]

# -------------------------------
# New Regime Slabs (FY 2025–26)
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

# -------------------------------
# Configurable caps & deductions
# -------------------------------
OLD_STD_DEDUCTION = 50000   # Old Regime (FY 2024–25)
NEW_STD_DEDUCTION = 75000   # New Regime (FY 2025–26, salaried only)
CAP_80C = 150000
CAP_80D = 50000
CAP_HOME_INTEREST = 200000
CESS = 0.04

# -------------------------------
# Old regime calculation (FY 2024–25)
# -------------------------------
def compute_tax_old(
    gross_income: float,
    investments_80c: float = 0.0,
    insurance_80d: float = 0.0,
    home_loan_interest: float = 0.0,
    education_loan_interest: float = 0.0,
    other_deductions: float = 0.0,
    is_salaried: bool = True,
) -> Tuple[float, float, float]:
    """
    Returns (tax_incl_cess, taxable_income, tax_before_cess)
    Implements Old Regime FY 2024–25.
    """
    investments = min(investments_80c or 0.0, CAP_80C)
    insurance = min(insurance_80d or 0.0, CAP_80D)
    home_interest = min(home_loan_interest or 0.0, CAP_HOME_INTEREST)

    taxable = gross_income - OLD_STD_DEDUCTION - investments - insurance - home_interest - (education_loan_interest or 0.0) - (other_deductions or 0.0)
    taxable = max(0.0, taxable)

    tax_before_cess = tax_from_slabs(taxable, old_slabs)

    # Section 87A rebate (classic rule)
    rebate = 0.0
    if taxable <= 500000:
        rebate = min(12500.0, tax_before_cess)

    tax_after_rebate = max(0.0, tax_before_cess - rebate)
    tax_incl_cess = round(tax_after_rebate * (1.0 + CESS), 2)

    return tax_incl_cess, taxable, round(tax_before_cess, 2)

# -------------------------------
# New regime calculation (FY 2025–26)
# -------------------------------
def compute_tax_new(
    gross_income: float,
    is_salaried: bool = True,
) -> Tuple[float, float, float]:
    """
    Returns (tax_incl_cess, taxable_income, tax_before_cess)
    Implements New Regime FY 2025–26.
    """
    taxable = gross_income - (NEW_STD_DEDUCTION if is_salaried else 0.0)
    taxable = max(0.0, taxable)

    # Rebate zone → zero tax
    if taxable <= 1_200_000:
        return 0.0, taxable, 0.0

    tax_before_cess = tax_from_slabs(taxable, new_slabs)
    tax_incl_cess = round(tax_before_cess * (1.0 + CESS), 2)
    return tax_incl_cess, taxable, round(tax_before_cess, 2)
