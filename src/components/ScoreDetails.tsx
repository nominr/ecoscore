import React, { useEffect, useState } from 'react';
import type { GreenScoreResponse, ScoreCategory } from '../types';

interface ScoreDetailsProps {
  result: GreenScoreResponse;
  className?: string; 
}

const categoryLabels: Record<keyof GreenScoreResponse['scores'], string> = {
  air_quality: 'Air Quality',
  tree_canopy: 'Tree Canopy',
  pavement: 'Pavement',
  static_flood_risk: 'Static Flood Risk',
  riverine_flood_risk: 'Flood Risk',
  traffic: 'Traffic',
  green_space: 'Green Space',
  toxic_sites: 'Toxic Sites',
  demographics: 'Demographics',
  water_availability: 'Water Availability',
  transit_access: 'Transit',
  sea_level_rise: 'Sea Level Rise'
};

const ScoreDetails: React.FC<ScoreDetailsProps> = ({ result, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showNote, setShowNote] = useState(true);


  if (!result || !result.scores) {
    return <div style={{ color: '#ffffff' }}>Loading...</div>;
  }
  useEffect(() => {
    setIsLoading(true);
    setLocalError(null);
    const t = setTimeout(() => {
      setIsLoading(false);
      setLocalError('Request timed out. Please try again.');
    }, 15000);

    if (!result) {
      setLocalError('No data received');
      setIsLoading(false);
      clearTimeout(t);
      return;
    }

    setIsLoading(false);
    clearTimeout(t);
  }, [result]);

  if (isLoading) return <div style={{ color: '#ffffff' }}>Loading...</div>;
  if (localError) return <div style={{ color: '#ff5555' }}>{localError}</div>;

    const entries = Object.entries(result.scores).filter(([key]) => {
      return (key as keyof GreenScoreResponse['scores']) in categoryLabels;
    });

    const ORDER: (keyof GreenScoreResponse['scores'])[] = [
      'air_quality',
      'tree_canopy',
      'pavement',
      'static_flood_risk',
      'riverine_flood_risk',
      'traffic',
      'green_space',
      'toxic_sites',
      'water_availability',
      'transit_access',
      'sea_level_rise',
      'demographics', // always last
    ];

    const orderIndex = new Map(ORDER.map((k, i) => [k, i]));
    const entriesSorted = entries.slice().sort((a, b) => {
      const ak = a[0] as keyof GreenScoreResponse['scores'];
      const bk = b[0] as keyof GreenScoreResponse['scores'];
      const ai = orderIndex.get(ak) ?? Number.POSITIVE_INFINITY;
      const bi = orderIndex.get(bk) ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });

  const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="sd-card">
      {title && <div className="sd-card-title">{title}</div>}
      <div className="sd-card-body">{children}</div>
    </div>
  );

  return (
    <div className={`sd-root ${className ?? ''}`}>
      {/* Hero Overall Score (full-width, above the grid) */}
      <div className="sd-hero">
        <div className="sd-hero-inner">
          <div className="sd-hero-label">Overall Score</div>
          <div className="sd-hero-score">
            {typeof result.overall_score === 'number' ? result.overall_score : 'N/A'}
          </div>
        </div>
      </div>

      {showNote && (
        <div className="sd-note" role="note" aria-live="polite">
          <div className="sd-note-dot" aria-hidden="true" />
          <div className="sd-note-text">
            <strong>Note:</strong> Score may not be accurate. Some data may be outdated or incorrect.
            This is a general idea.
          </div>
          <button
            className="sd-note-close"
            onClick={() => setShowNote(false)}
            aria-label="Dismiss note"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Two-column grid of category cards (responsive) */}
      <div className="sd-grid">
        {entriesSorted.map(([key, value]) => {
          const catKey = key as keyof GreenScoreResponse['scores'];
          const label = categoryLabels[catKey];
          const cat = value as ScoreCategory | undefined;

          return (
            <Card key={key} title={label}>
              {!cat ? (
                <div className="sd-muted">No data</div>
              ) : 'error' in cat ? (
                <div className="sd-error">
                  {/* Error{cat.timeout ? ' (timeout)' : ''}: {cat.error} */}
                  Data unavailable for this category.
                </div>
              ) : (
                <div className="sd-fields">
                  {/* Generic (not for demographics) */}
                  {catKey !== 'demographics' && (
                    <>
                      <div><strong>Score:</strong> {typeof cat.score === 'number' ? cat.score : 'N/A'}</div>
                      {'percentage' in cat && typeof cat.percentage === 'number' && (
                        <div><strong>Percentage:</strong> {cat.percentage.toFixed(1)}%</div>
                      )}
                    </>
                  )}

                  {/* Category-specific details */}
                  {catKey === 'air_quality' && cat.max_aqi !== undefined && (
                    <div><strong>Max AQI:</strong> {cat.max_aqi}{cat.primary_pollutant ? ` (${cat.primary_pollutant})` : ''}</div>
                  )}

                  {/* Flood risk details: static or riverine */}
                  {typeof cat.nearest_flood_distance_km === 'number' && (
                    <div><strong>Nearest Flood:</strong> {cat.nearest_flood_distance_km.toFixed(1)} km</div>
                  )}
                  {cat.in_100_year !== undefined && (
                    <div><strong>100 Year Flood?</strong> {cat.in_100_year ? 'Yes' : 'No'}</div>
                  )}

                  {/* Traffic */}
                  {catKey === 'traffic' && typeof cat.weighted_road_length === 'number' && (
                    <div><strong>Weighted Road Length:</strong> {cat.weighted_road_length.toFixed(0)} m</div>
                  )}

                  {/* Green space */}
                  {catKey === 'green_space' && (
                    <>
                      {typeof cat.nearest_distance_m === 'number' && (
                        <div><strong>Nearest Park:</strong> {cat.nearest_distance_m.toFixed(0)} m</div>
                      )}
                      {cat.num_parks !== undefined && (
                        <div><strong>Parks Count:</strong> {cat.num_parks}</div>
                      )}
                    </>
                  )}

                  {/* Toxic sites */}
                  {catKey === 'toxic_sites' && (
                    <>
                      {cat.num_sites !== undefined && (
                        <div><strong>Number of Sites:</strong> {cat.num_sites}</div>
                      )}
                      {typeof cat.nearest_distance_miles === 'number' && (
                        <div><strong>Nearest Site:</strong> {cat.nearest_distance_miles.toFixed(2)} miles</div>
                      )}
                    </>
                  )}

                  {/* Transit access */}
                  {catKey === 'transit_access' && cat.stops_count !== undefined && (
                    <div><strong>Stops Count:</strong> {cat.stops_count}</div>
                  )}

                  {/* Water availability */}
                  {catKey === 'water_availability' && cat.water_features !== undefined && (
                    <div><strong>Water Features:</strong> {cat.water_features}</div>
                  )}

                  {/* Sea level rise */}
                  {catKey === 'sea_level_rise' && cat.inundated_feet && (
                    <div>
                      <strong>Inundated At:</strong>{' '}
                      {(() => {
                        const pairs = Object.entries(cat.inundated_feet as Record<string, boolean | null>);
                        const inundated = pairs.filter(([, val]) => val).map(([ft]) => `${ft}ft`);
                        return inundated.length > 0 ? inundated.join(', ') : 'None';
                      })()}
                    </div>
                  )}

                  {/* Demographics */}
                  {catKey === 'demographics' && (
                    <div className="sd-fields sd-demographics">
                      {typeof cat.total_population === 'number' && (
                        <div><strong>Total Population:</strong> {cat.total_population.toLocaleString()}</div>
                      )}
                      {typeof cat.percent_male === 'number' && (
                        <div><strong>Percent Male:</strong> {cat.percent_male.toFixed(1)}%</div>
                      )}
                      {typeof cat.percent_female === 'number' && (
                        <div><strong>Percent Female:</strong> {cat.percent_female.toFixed(1)}%</div>
                      )}
                      {typeof cat.median_age === 'number' && (
                        <div><strong>Median Age:</strong> {cat.median_age.toFixed(1)}</div>
                      )}
                      {typeof cat.median_income === 'number' && (
                        <div><strong>Median Income:</strong> ${cat.median_income.toLocaleString()}</div>
                      )}
                      {typeof cat.poverty_rate === 'number' && (
                        <div><strong>Poverty Rate:</strong> {cat.poverty_rate.toFixed(1)}%</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* styles */}
      <style>{`
      /* Notice box */
        .sd-note {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: start;
          gap: 0.75rem;
          margin: 0 0 1rem 0;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 200, 0, 0.35);
          background:
            radial-gradient(100% 120% at 0% 0%, rgba(255, 200, 0, 0.10), transparent 60%),
            rgba(80, 60, 0, 0.22);
          color: #fff7cc;
          box-shadow:
            0 0 16px rgba(255, 200, 0, 0.18),
            inset 0 0 10px rgba(255, 180, 0, 0.12);
          backdrop-filter: blur(8px) saturate(150%);
          -webkit-backdrop-filter: blur(8px) saturate(150%);
        }
        .sd-note-dot {
          width: 10px;
          height: 10px;
          margin-top: 0.25rem;
          border-radius: 50%;
          background: #ffcc33;
          box-shadow: 0 0 10px rgba(255, 200, 0, 0.7);
        }
        .sd-note-text { font-size: 0.95rem; line-height: 1.35; }
        .sd-note-text strong { color: #ffe082; }
        .sd-note-close {
          appearance: none;
          background: transparent;
          border: none;
          color: #ffd369;
          font-size: 1.1rem;
          line-height: 1;
          padding: 0.15rem 0.4rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .sd-note-close:hover { background: rgba(255, 200, 0, 0.14); }

        /* Hide notice in print */
        @media print { .sd-note { display: none; } }

        .sd-root { width: 100%; }
        .sd-muted { color: #aaa; }
        .sd-error { color: #ff6b6b; }
        .sd-fields { font-size: 0.95rem; color: #d6e7ff; }
        .sd-fields > div { margin: 0.15rem 0; }

        /* Hero card */
        .sd-hero {
          position: relative;
          margin: 0 0 1rem 0;
          border-radius: 16px;
          background: radial-gradient(120% 120% at 30% 10%, rgba(0, 255, 255, 0.18), rgba(0,0,0,0)) ,
                      rgba(0, 40, 80, 0.28);
          border: 1px solid rgba(0, 255, 255, 0.35);
          box-shadow:
            0 0 26px rgba(0, 255, 255, 0.22),
            inset 0 0 14px rgba(0, 200, 255, 0.18);
          backdrop-filter: blur(10px) saturate(170%);
          -webkit-backdrop-filter: blur(10px) saturate(170%);
          overflow: hidden;
        }
        /* subtle animated glow ring */
        .sd-hero::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: conic-gradient(
            from 0deg,
            rgba(0,255,255,0.0),
            rgba(0,255,255,0.35),
            rgba(0,255,255,0.0) 60%
          );
          animation: sd-rotate 9s linear infinite;
          filter: blur(24px);
          opacity: 0.35;
          pointer-events: none;
        }
        @keyframes sd-rotate { to { transform: rotate(360deg); } }

        .sd-hero-inner {
          position: relative;
          z-index: 1;
          padding: 1.1rem 1.2rem;
          text-align: left;
        }
        .sd-hero-label {
          font-weight: 700;
          letter-spacing: 0.6px;
          color: #cfeeff;
          opacity: 0.9;
          margin-bottom: 0.3rem;
        }
        .sd-hero-score {
          font-size: clamp(2.2rem, 6vw, 3.5rem);
          line-height: 1;
          font-weight: 900;
          color: #00D455;
          text-shadow:
            0 0 12px rgba(0, 212, 85, 0.55),
            0 0 30px rgba(0, 212, 85, 0.25);
        }

        /* Generic card */
        .sd-card {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(0, 40, 80, 0.22);
          color: #fff;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          box-shadow: 0 0 12px rgba(0,255,255,0.12), inset 0 0 8px rgba(0,200,255,0.12);
          backdrop-filter: blur(8px) saturate(150%);
          -webkit-backdrop-filter: blur(8px) saturate(150%);
          min-width: 0;
        }
        .sd-card-title {
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        /* Two-column grid under the hero */
        .sd-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem 1.25rem;
          align-content: start;
        }
        .sd-grid > * { min-width: 0; }

        /* Stack on smaller screens */
        @media (max-width: 900px) {
          .sd-grid { grid-template-columns: 1fr; }
          .sd-hero-inner { text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default ScoreDetails;