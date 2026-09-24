import React from 'react';

/** Common module (4 units) keeps tooth pitch identical across the train. */
export function gearGeometry(teeth: number) {
  const count = Math.max(8, Math.round(teeth));
  const pitchRadius = count * 2;
  const outerRadius = pitchRadius + 2;
  const points = Array.from({ length: count }, (_, tooth) =>
    [[-.5, -2.5], [-.34, -2.5], [-.22, 2], [.22, 2], [.34, -2.5], [.5, -2.5]]
      .map(([offset, height]) => {
        const angle = (tooth + offset) * Math.PI * 2 / count;
        const radius = pitchRadius + height;
        return `${(outerRadius + radius * Math.cos(angle)).toFixed(3)},${(outerRadius + radius * Math.sin(angle)).toFixed(3)}`;
      }).join(' ')
  ).join(' ');
  return { count, pitchRadius, outerRadius, points };
}

export interface MechanicalGearProps {
  teeth?: number;
  size?: number;
  accent?: boolean;
}

/** Static manufactured geometry; GearAssembly drives the external HTML wrapper. */
export function MechanicalGear({ teeth = 24, size, accent = false }: MechanicalGearProps) {
  const { pitchRadius: r, outerRadius: c, points } = gearGeometry(teeth);
  return (
    <svg width={size ?? c * 2} height={size ?? c * 2} viewBox={`0 0 ${c * 2} ${c * 2}`}
      aria-hidden="true" focusable="false" className={accent ? 'mechanical-gear mechanical-gear--brass' : 'mechanical-gear'}>
      <polygon points={points} className="mechanical-gear-body" strokeWidth=".8" strokeLinejoin="round" />
      <circle cx={c} cy={c} r={r - 6} fill="none" stroke="currentColor" strokeWidth=".6" opacity=".65" />
      <circle cx={c} cy={c} r={r * .64} fill="#061b3a" stroke="currentColor" strokeWidth="1" />
      {[0, 120, 240].map(angle => (
        <path key={angle} d={`M ${c + r * .2} ${c} H ${c + r * .62}`} transform={`rotate(${angle} ${c} ${c})`}
          stroke="currentColor" strokeWidth={r * .12} opacity=".6" />
      ))}
      <circle cx={c} cy={c} r={r * .27} className="mechanical-gear-body" strokeWidth="1" />
      <circle cx={c} cy={c} r={r * .12} fill="#06162f" stroke="currentColor" strokeWidth=".7" />
      <path d={`M ${c - 2} ${c - r * .12} v -2 h 4 v 2`} fill="#06162f" stroke="currentColor" strokeWidth=".5" />
    </svg>
  );
}
