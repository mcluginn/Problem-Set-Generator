# Domain Analysis & Content Blueprint: IE Special Topics 1 (BSIE 3219)

## Current Status: `REPRESENTATIVE_READY` (Awaiting Teacher Review)

### Skill Coverage (10 Skills)
- 7 registered representative problem families:
  - `FAM-BSIE3219-COMPOUND-INTEREST`: Single-payment compound future worth $F = P(1+i)^n$
  - `FAM-BSIE3219-UNIFORM-ANNUITY`: Uniform series present worth $P = A [((1+i)^n - 1) / (i(1+i)^n)]$
  - `FAM-BSIE3219-DEPRECIATION-SCHEDULE`: Straight-line depreciation $D = (C - S) / N$
  - `FAM-BSIE3219-BENEFIT-COST-ANALYSIS`: Benefit-Cost ratio feasibility $B/C = \text{PW}(B) / \text{PW}(C)$
  - `FAM-BSIE3219-LINEAR-PROGRAMMING`: Two-variable profit maximization objective & constraints
  - `FAM-BSIE3219-CPM-PERT-NETWORK`: Critical path total project duration summation
  - `FAM-BSIE3219-EOQ-INVENTORY`: Ford W. Harris Economic Order Quantity $\text{EOQ} = \sqrt{2DS/H}$

### Domain Validation Mechanics
- Positive investment horizon ($n \ge 1\text{ year}$).
- Positive nominal and effective interest rates ($i > 0\%$).
- Capital asset salvage value bounded by initial investment ($S \le C$).
- Benefit-Cost ratio decision consistency ($B/C \ge 1.0 \implies \text{Economically Justified}$).

### Remaining Scaling Milestones
1. Add gradient series (arithmetic and geometric cash flow gradients).
2. Add Simplex tableau step-by-step pivot solvers for higher-dimensional LPs.
3. Conduct formal teacher review on draft representative items.
