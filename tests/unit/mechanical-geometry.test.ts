import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { gearGeometry, MechanicalGear } from '@/components/mechanical/MechanicalGear';
import { GEAR_TRAIN, GearAssembly } from '@/components/mechanical/GearAssembly';
import { MechanicalLoader } from '@/components/mechanical/MechanicalLoader';

describe('mechanical visual system', () => {
  it('uses a common module, tangent pitch circles and opposing neighbors', () => {
    for (let i = 1; i < GEAR_TRAIN.length; i++) {
      const a = GEAR_TRAIN[i - 1], b = GEAR_TRAIN[i];
      expect(Math.hypot(a.x - b.x, a.y - b.y)).toBe(a.teeth * 2 + b.teeth * 2);
      expect(a.direction).toBe(-b.direction);
      expect(a.teeth).toBeGreaterThan(b.teeth);
    }
  });
  it('generates finite, bounded tooth profiles for each supported gear', () => {
    for (const { teeth } of GEAR_TRAIN) {
      const geometry = gearGeometry(teeth);
      expect(geometry.points.split(' ')).toHaveLength(teeth * 6);
      for (const point of geometry.points.split(' ')) {
        for (const coordinate of point.split(',').map(Number)) {
          expect(coordinate).toBeGreaterThanOrEqual(0);
          expect(coordinate).toBeLessThanOrEqual(geometry.outerRadius * 2);
        }
      }
    }
  });
  it('renders deterministic decorative SVG and all explicit states', () => {
    expect(renderToStaticMarkup(React.createElement(MechanicalGear))).toContain('aria-hidden="true"');
    for (const state of ['idle', 'processing', 'generation', 'success', 'error'] as const) {
      const markup = renderToStaticMarkup(React.createElement(GearAssembly, { state }));
      expect(markup).toContain(`data-mechanical-state="${state}"`);
      expect(markup.match(/data-gear-rotor/g)).toHaveLength(3);
    }
  });
  it('retains real loading text separately from the decorative assembly', () => {
    const markup = renderToStaticMarkup(React.createElement(MechanicalLoader, { label: 'Loading next problem...' }));
    expect(markup).toContain('role="status"');
    expect(markup).toContain('Loading next problem...');
  });
});
