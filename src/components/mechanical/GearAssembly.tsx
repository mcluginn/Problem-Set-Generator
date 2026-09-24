'use client';

import React, { useEffect, useRef } from 'react';
import { MechanicalGear } from './MechanicalGear';

export type MechanicalState = 'idle' | 'processing' | 'generation' | 'success' | 'error';
export const GEAR_TRAIN = [
  { x: 65, y: 66, teeth: 24, direction: 1, phase: 0 },
  { x: 145, y: 66, teeth: 16, direction: -1, phase: 11.25 },
  { x: 145, y: 122, teeth: 12, direction: 1, phase: 0 },
] as const;
const RATES: Record<MechanicalState, number> = { idle: 1.0, processing: 1.8, generation: 2.5, success: 0, error: 0 };

export interface GearAssemblyProps {
  state?: MechanicalState;
  scale?: 'small' | 'medium' | 'large';
  className?: string;
}

export function GearAssembly({ state = 'idle', scale = 'medium', className = '' }: GearAssemblyProps) {
  const root = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const targetRate = useRef(RATES[state]);
  targetRate.current = RATES[state];

  useEffect(() => {
    const element = root.current;
    if (!element || !Element.prototype.animate) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    const syncVisibility = () => animations.current.forEach(animation => {
      if (motion.matches || document.hidden || !visible) animation.pause();
      else animation.play();
    });
    animations.current = Array.from(element.querySelectorAll<HTMLElement>('[data-gear-rotor]')).map((rotor, i) => {
      const gear = GEAR_TRAIN[i];
      const animation = rotor.animate([
        { transform: `rotate(${gear.phase}deg)` },
        { transform: `rotate(${gear.phase + gear.direction * 360}deg)` },
      ], { duration: gear.teeth * 250, iterations: Infinity, easing: 'linear' });
      animation.startTime = document.timeline.currentTime;
      animation.playbackRate = targetRate.current;
      return animation;
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncVisibility(); });
    observer.observe(element);
    motion.addEventListener('change', syncVisibility);
    document.addEventListener('visibilitychange', syncVisibility);
    syncVisibility();
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', syncVisibility);
      document.removeEventListener('visibilitychange', syncVisibility);
      animations.current.forEach(animation => animation.cancel());
      animations.current = [];
    };
  }, []);

  useEffect(() => {
    // A short, bounded speed ramp preserves angular phase: never restart a gear.
    // Rendering stays browser-native; no animation-frame loop or React frame updates.
    const start = animations.current[0]?.playbackRate ?? RATES[state];
    let step = 0;
    const timer = window.setInterval(() => {
      const t = Math.min(++step / 16, 1);
      const eased = t * t * (3 - 2 * t);
      animations.current.forEach(animation => animation.updatePlaybackRate(start + (RATES[state] - start) * eased));
      if (t === 1) window.clearInterval(timer);
    }, 40);
    return () => window.clearInterval(timer);
  }, [state]);

  return (
    <div ref={root} aria-hidden="true" data-mechanical-state={state}
      className={`gear-assembly gear-assembly--${scale} ${className}`}>
      <div className="gear-assembly-plane">
        <svg className="gear-construction" viewBox="0 0 195 155" focusable="false">
          <path d="M 5 66 H 190 M 65 6 V 125 M 145 18 V 151" fill="none" stroke="currentColor" strokeWidth=".5" strokeDasharray="2 5" />
          <circle cx="65" cy="66" r="57" fill="none" stroke="currentColor" strokeWidth=".5" />
        </svg>
        {GEAR_TRAIN.map((gear, i) => {
          const radius = gear.teeth * 2 + 2;
          return <div key={gear.teeth} className={`gear-position gear-position--${i}`} style={{ left: gear.x - radius, top: gear.y - radius, width: radius * 2, height: radius * 2 }}>
            <div data-gear-rotor style={{ transform: `rotate(${gear.phase}deg)` }}>
              <MechanicalGear teeth={gear.teeth} accent={i === 1} />
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}
