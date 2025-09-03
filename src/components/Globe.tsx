import React, { useEffect, useRef, useState } from 'react';
import GlobeGL from 'react-globe.gl';

type ControlOptions = {
  enableZoom?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  minDistanceMul?: number;
  maxDistanceMul?: number;
  lockDistanceMul?: number;
  initialAltitude?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
};

type Props = {
  className?: string;
  maxSize?: number;
  minSize?: number;
  controls?: ControlOptions;
};

const Globe: React.FC<Props> = ({
  className,
  maxSize = 1100,
  minSize = 260,
  controls = {}
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [size, setSize] = useState(0);

  // measure parent
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const s = Math.max(minSize, Math.min(maxSize, Math.floor(Math.min(width, height))));
      setSize(s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [minSize, maxSize]);

  // controls
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !size) return;

    const c = g.controls();

    const {
      enableZoom = true,
      enablePan = false,
      autoRotate = true,
      autoRotateSpeed = 0.5,
      minDistanceMul = 0.9,
      maxDistanceMul = 2.8,
      lockDistanceMul,
      initialAltitude,
      minPolarAngle,
      maxPolarAngle
    } = controls;

    c.enableZoom = enableZoom;
    c.enablePan  = enablePan;
    c.autoRotate = autoRotate;
    c.autoRotateSpeed = autoRotateSpeed;

    if (typeof minPolarAngle === 'number') c.minPolarAngle = minPolarAngle;
    if (typeof maxPolarAngle === 'number') c.maxPolarAngle = maxPolarAngle;

    if (typeof lockDistanceMul === 'number') {
      const d = size * lockDistanceMul;
      c.minDistance = d;
      c.maxDistance = d;
    } else {
      c.minDistance = size * minDistanceMul;
      c.maxDistance = size * maxDistanceMul;
    }

    c.target.set(0, 0, 0);
    c.update();

    if (typeof initialAltitude === 'number') {
      g.pointOfView({ altitude: initialAltitude }, 0);
    }
  }, [controls, size]);

  return (
    <div ref={wrapRef} className={className} style={{ display:'grid', placeItems:'center', width:'100%', height:'100%' }}>
      {size > 0 && (
        <GlobeGL
          ref={globeRef}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-day.jpg"
          showAtmosphere
          atmosphereColor="#0a84ff"
          atmosphereAltitude={0.25}
        />
      )}
    </div>
  );
};

export default Globe;
