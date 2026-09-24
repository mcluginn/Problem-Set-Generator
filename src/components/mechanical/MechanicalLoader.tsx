import React from 'react';
import { GearAssembly, GearAssemblyProps } from './GearAssembly';

export function MechanicalLoader({ label, state = 'generation', scale = 'small', className = '' }:
  GearAssemblyProps & { label: string }) {
  const busy = state === 'processing' || state === 'generation';
  return <div className={`mechanical-loader ${className}`} data-busy={busy}>
    <GearAssembly state={state} scale={scale} />
    <span role="status" aria-live="polite" aria-atomic="true">{label}</span>
  </div>;
}
