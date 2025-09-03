import type {} from '../components/Globe';

export const HOME_GLOBE = {
  enableZoom: false,
  enablePan: false,
  autoRotate: true,
  autoRotateSpeed: 0.5,
  minDistanceMul: 0.5,
  maxDistanceMul: 2.0,
  initialAltitude: 1.05
} as const;

export const INPUT_GLOBE = {
  enableZoom: false,
  enablePan: false,
  autoRotate: true,
  autoRotateSpeed: 0.5,
  lockDistanceMul: 1.12,
  initialAltitude: 1.05,
} as const;
