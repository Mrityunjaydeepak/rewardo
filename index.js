const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const BROWSERLESS_TOKEN = '2SR99EoARKDVmFOc5b5e32df6355fc31353ef8845a37414a4';

// Your Rewardoo tracking URL (replace if needed)
const TRACKING_URL = 'https://admin.rewardoo.com/track/9b235NBDbO7usq_b4Lx2UdgKkLV6jGm88d36ZvJ0M268Z1JhVAohdYDm_bvqTMZMdoGmQKrDP3vbAc?source=inner&url=https%3A%2F%2Fwww.intersport.de%2F';

app.get('/go', async (req, res) => {
  try {
    // Call Browserless to open the tracking URL and wait for redirects
    const browserlessUrl = `https://chrome.browserless.io/content?token=${BROWSERLESS_TOKEN}&url=${encodeURIComponent(TRACKING_URL)}`;

    const result = await axios.get(browserlessUrl, {
      maxRedirects: 0, // We want to capture where it lands
      validateStatus: status => status >= 200 && status < 400,
    });

    const finalUrl = result.request.res.responseUrl;

    if (finalUrl && finalUrl.includes('intersport.de')) {
      console.log('✅ Final redirect URL:', finalUrl);
      return res.redirect(302, finalUrl);
    } else {
      console.warn('⚠️ Could not resolve a valid Intersport URL. Redirecting to fallback.');
      return res.redirect(302, 'https://www.intersport.de/');
    }

  } catch (err) {
    console.error('❌ Error resolving final URL via Browserless:', err.message);
    return res.status(500).send('Failed to resolve final redirect.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/go`);
});
