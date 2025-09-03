/**
 * Represents a single category score returned by the backend. Many scores
 * include a numeric score along with additional fields such as a raw
 * percentage, source name and acquisition date. When a category fails to
 * compute, it will contain an `error` property instead.
 */
export interface ScoreCategory {
  score?: number;
  percentage?: number;
  max_aqi?: number;
  primary_pollutant?: string;
  observations?: any;
  zones?: any;
  in_100_year?: boolean;
  sfha?: any;
  weighted_road_length?: number;
  nearest_distance_m?: number;
  num_parks?: number;
  // components?: any;
  num_sites?: number;
  nearest_distance_miles?: number;
  total_population?: number;
  percent_male?: number;
  percent_female?: number;
  median_age?: number;
  percent_white?: number;
  percent_black?: number;
  percent_hispanic?: number;
  median_income?: number;
  poverty_rate?: number;
  error?: string;
  timeout?: boolean;
  source?: string;
  acquired?: string;
  nearest_flood_distance_km?: number;
  water_features?: number;
  stops_count?: number;
  method?: string;
  inundated_feet?: any;
}

/**
 * The full response shape returned by the `/green-score` endpoint.
 */
export interface GreenScoreResponse {
  zip: string;
  coordinates: [number, number];
  scores: {
    air_quality?: ScoreCategory;
    tree_canopy?: ScoreCategory;
    pavement?: ScoreCategory;
    static_flood_risk?: ScoreCategory;
    riverine_flood_risk?: ScoreCategory;
    traffic?: ScoreCategory;
    green_space?: ScoreCategory;
    toxic_sites?: ScoreCategory;
    demographics?: ScoreCategory;
    water_availability?: ScoreCategory;
    transit_access?: ScoreCategory;
    sea_level_rise?: ScoreCategory;
  };
  overall_score: number | null;
}