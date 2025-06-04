const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const BROWSERLESS_TOKEN = '2SR99EoARKDVmFOc5b5e32df6355fc31353ef8845a37414a4';

const TRACKING_URL = 'https://admin.rewardoo.com/track/9b235NBDbO7usq_b4Lx2UdgKkLV6jGm88d36ZvJ0M268Z1JhVAohdYDm_bvqTMZMdoGmQKrDP3vbAc?source=inner&url=https%3A%2F%2Fwww.intersport.de%2F';

app.get('/go', async (req, res) => {
  try {
    const browserlessUrl = `https://production-sfo.browserless.io/function?token=${BROWSERLESS_TOKEN}`;

    // ✅ Properly formatted as a full stringified async function
    const payload = {
      code: `(async ({ page }) => {
        await page.goto("${TRACKING_URL}", { waitUntil: "networkidle2", timeout: 15000 });
        await page.waitForTimeout(3000);
        return page.url();
      })`
    };

    const result = await axios.post(browserlessUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000
    });

    const finalUrl = result.data;

    if (finalUrl && finalUrl.includes('intersport.de')) {
      console.log('✅ Final redirect URL:', finalUrl);
      return res.redirect(302, finalUrl);
    } else {
      console.warn('⚠️ Unexpected or empty final URL:', finalUrl);
      return res.redirect(302, 'https://www.intersport.de/');
    }

  } catch (err) {
    console.error('❌ Browserless function error:', err.response?.data || err.message);
    return res.status(500).send('Failed to resolve final redirect.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/go`);
});
