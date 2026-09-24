# Domain Analysis & Content Blueprint: Physics 2 for Engineers (GEN 0110)

## Current Status: `REPRESENTATIVE_READY` (Awaiting Teacher Review)

### Skill Coverage (10 Skills)
- 7 registered representative problem families:
  - `FAM-GEN0110-FLUID-PRESSURE`: Hydrostatic pressure $P = \rho g h$
  - `FAM-GEN0110-BUOYANCY-ARCHIMEDES`: Archimedes Principle buoyant force $F_b = \rho V g$
  - `FAM-GEN0110-HEAT-CONDUCTION`: Fourier 1D steady-state conduction rate $\dot{Q} = k A \Delta T / L$
  - `FAM-GEN0110-DC-CIRCUITS-OHM`: Series-parallel equivalent resistance and Ohm's Law $I = V / R_{\text{eq}}$
  - `FAM-GEN0110-COULOMB-FORCE`: Electrostatic Coulomb force $F = k |q_1 q_2| / r^2$
  - `FAM-GEN0110-SNELL-REFRACTION`: Snell's Law $n_1 \sin \theta_1 = n_2 \sin \theta_2$
  - `FAM-GEN0110-DOPPLER-SHIFT`: Acoustic Doppler frequency shifts $f' = f \cdot v / (v \mp v_s)$

### Domain Validation Mechanics
- Explicit physical unit enforcement (e.g. $\text{m/s}, \text{kPa}, \text{N}, \text{W}, \text{A}, \Omega, \text{Hz}$).
- Positive passive electrical resistance constraint ($R > 0\ \Omega$).
- Sub-luminal relativistic speed check ($v \le 3.0 \times 10^8\text{ m/s}$).
- Refractive index physical lower bound in standard media ($n \ge 1.0$).
- Non-negative hydrostatic fluid depth coordinate ($h \ge 0$).

### Remaining Scaling Milestones
1. Add Kirchhoff's junction and loop multi-loop circuit solvers.
2. Add Gauss's Law spherical/cylindrical symmetry electric flux problems.
3. Conduct formal teacher review on draft representative items.
