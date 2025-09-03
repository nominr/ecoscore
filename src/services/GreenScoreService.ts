import { GreenScoreResponse } from '../types';

/**
 * Service wrapper responsible for communicating with the FastAPI backend.
 * All API calls are centralised here to keep components free of fetch
 * logic and to facilitate future enhancements such as auth or retries.
 */
class GreenScoreService {
  private static API_BASE = '/green-score';

  /**
   * Fetch a green score for a given ZIP code. Optionally abort the
   * request if it takes longer than the provided timeout (ms). On
   * network failure the returned promise will reject.
   */
  static async fetchGreenScore(zip: string, timeoutMs: number = 30000): Promise<GreenScoreResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${this.API_BASE}?zip=${encodeURIComponent(zip)}`, {
        method: 'GET',
        signal: controller.signal,
      });
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