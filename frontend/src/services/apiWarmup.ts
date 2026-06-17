import { getApiOrigin } from '../config/apiConfig';

const WARMUP_TIMEOUT_MS = 45000;

/**
 * Wake Render free-tier (and similar) hosts before auth calls.
 * First request after idle can take 30–60s; login timeout was failing before wake completes.
 */
export async function warmupApi(maxAttempts = 2): Promise<boolean> {
  const origin = getApiOrigin();
  const healthUrl = `${origin}/health`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), WARMUP_TIMEOUT_MS);
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (response.ok) return true;
    } catch {
      // Retry once after a short pause (cold start still spinning up).
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  }

  return false;
}
