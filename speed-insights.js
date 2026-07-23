// ============================================
// Vercel Speed Insights initialization
// ============================================

import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights with default configuration
injectSpeedInsights({
  debug: false
});
