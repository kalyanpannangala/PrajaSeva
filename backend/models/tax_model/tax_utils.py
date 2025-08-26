# tax_utils.py
"""
Tax calculation utilities for PrajaSeva tax module.

Assumptions / notes:
- Old Regime: Standard deduction = 50,000 (FY 2024-25)
- New Regime: Standard deduction = 75,000 (salaried) (Budget 2025 change)
- Section 80E (education loan interest) is applied ONLY to Old Regime.
- Section 80C cap = 150,000; Section 80D cap used here = 50,000 (basic handling).
- Home loan interest cap (self-occupied) used as 200,000 (common case).
- Section 87A rebate: implemented:
    - Old Regime: up to ₹5,00,000 => rebate up to ₹12,500 (classic rule)
    - New Regime (Budget 2025): rebate up to ₹60,000 for incomes below threshold
      (we use ₹12,00,000 threshold approximation; see notes/caveat below).
- All computed taxes include 4% cess at the end.
- This module implements deterministic, illustrative calculations for comparison.
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
# Slabs (use the updated version you prefer)
# These slabs are taken as an implementation choice consistent with FY-2025 changes.
# Modify them if you have official different slab numbers.
# -------------------------------
old_slabs = [
    (0, 250000, 0.0),
    (250000, 500000, 0.05),
    (500000, 1000000, 0.20),
    (1000000, 50000000, 0.30),
]

# New regime slabs (example / suggested for FY 2025 changes).
# If your official numbers differ, replace these values.
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
OLD_STD_DEDUCTION = 50000   # typical classical standard deduction (old regime)
NEW_STD_DEDUCTION = 75000   # per Budget 2025 for salaried (new regime)
CAP_80C = 150000
CAP_80D = 50000
CAP_HOME_INTEREST = 200000  # for self-occupied (common cap used)
CESS = 0.04

# -------------------------------
# Old regime calculation
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
    Returns (tax_amount_incl_cess, taxable_income_used, tax_before_cess)
    Old regime subtracts standard deduction (50k) and allowed deductions.
    """
    # apply caps
    investments = min(investments_80c or 0.0, CAP_80C)
    insurance = min(insurance_80d or 0.0, CAP_80D)
    home_interest = min(home_loan_interest or 0.0, CAP_HOME_INTEREST)

    taxable = gross_income - OLD_STD_DEDUCTION - investments - insurance - home_interest - (education_loan_interest or 0.0) - (other_deductions or 0.0)
    taxable = max(0.0, taxable)

    tax_before_cess = tax_from_slabs(taxable, old_slabs)

    # Section 87A rebate for old regime (classic rule)
    rebate = 0.0
    if taxable <= 500000:
        rebate = min(12500.0, tax_before_cess)

    tax_after_rebate = max(0.0, tax_before_cess - rebate)
    tax_incl_cess = round(tax_after_rebate * (1.0 + CESS), 2)

    return tax_incl_cess, taxable, round(tax_before_cess, 2)

# -------------------------------
# New regime calculation
# -------------------------------
def compute_tax_new(
    gross_income: float,
    is_salaried: bool = True,
) -> Tuple[float, float, float]:
    """
    New regime calculation:
    - Apply new standard deduction (75k) for salaried (Budget 2025).
    - Most Chapter VI-A deductions (80C/80D/80E) are NOT applied here.
    - Apply rebate (87A) for the new regime (Budget 2025 changes).
    Returns (tax_incl_cess, taxable_income_used, tax_before_cess).
    """

    taxable = gross_income - (NEW_STD_DEDUCTION if is_salaried else 0.0)
    taxable = max(0.0, taxable)

    tax_before_cess = tax_from_slabs(taxable, new_slabs)

    # Rebate under 87A — Budget 2025: increased (implementation detail: cap used here)
    # Many authoritative sources explain the new rebate up to ₹60,000 for lower incomes.
    # We'll apply a simplified rule: rebate up to ₹60,000 when taxable <= 1,200,000.
    rebate = 0.0
    if taxable <= 1200000:
        rebate = min(60000.0, tax_before_cess)

    tax_after_rebate = max(0.0, tax_before_cess - rebate)
    tax_incl_cess = round(tax_after_rebate * (1.0 + CESS), 2)

    return tax_incl_cess, taxable, round(tax_before_cess, 2)

# -------------------------------
# Convenience summary function
# -------------------------------
def compute_tax_summary(
    gross_income: float,
    *,
    is_salaried: bool = True,
    investments_80c: float = 0.0,
    insurance_80d: float = 0.0,
    home_loan_interest: float = 0.0,
    education_loan_interest: float = 0.0,
    other_deductions: float = 0.0,
) -> dict:
    """
    Compute both regime taxes and return a structured summary dictionary.
    """
    old_tax, old_taxable, old_before = compute_tax_old(
        gross_income=gross_income,
        investments_80c=investments_80c,
        insurance_80d=insurance_80d,
        home_loan_interest=home_loan_interest,
        education_loan_interest=education_loan_interest,
        other_deductions=other_deductions,
        is_salaried=is_salaried,
    )

    new_tax, new_taxable, new_before = compute_tax_new(
        gross_income=gross_income,
        is_salaried=is_salaried,
    )

    savings = round(old_tax - new_tax, 2)

    recommended = "New Regime" if new_tax < old_tax else "Old Regime"
    return {
        "gross_income": gross_income,
        "old": {
            "taxable_income": old_taxable,
            "tax_before_cess": old_before,
            "tax_incl_cess": old_tax,
        },
        "new": {
            "taxable_income": new_taxable,
            "tax_before_cess": new_before,
            "tax_incl_cess": new_tax,
        },
        "savings_if_new_minus_old": savings,
        "recommended_regime": recommended,
    }
