import { GreenScoreResponse } from '../types';

/**
 * Service wrapper responsible for communicating with the FastAPI backend.
 */
class GreenScoreService {
  // Use env var; fallback to empty so devs get an error if not set
  private static API_BASE =
    (import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? "") + "/green-score";

  /**
   * Fetch a green score for a given ZIP code.
   */
  static async fetchGreenScore(
    zip: string,
    timeoutMs: number = 30000
  ): Promise<GreenScoreResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(
        `${this.API_BASE}?zip=${encodeURIComponent(zip)}`,
        {
          method: "GET",
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      const json = await response.json();
      return json as GreenScoreResponse;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }
}

export default GreenScoreService;