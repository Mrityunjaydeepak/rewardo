const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = 3000;

// Your Rewardoo or affiliate tracking link
const TRACKING_URL = 'https://admin.rewardoo.com/track/9b235NBDbO7usq_b4Lx2UdgKkLV6jGm88d36ZvJ0M268Z1JhVAohdYDm_bvqTMZMdoGmQKrDP3vbAc?source=inner&url=https%3A%2F%2Fwww.intersport.de%2F';

app.get('/go', async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set real-looking headers (optional but helps bypass bot protection)
    await page.setUserAgent(req.headers['user-agent'] || 'Mozilla/5.0');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto(TRACKING_URL, { waitUntil: 'networkidle2', timeout: 15000 });

    // Wait for potential JavaScript-based redirects
 await new Promise(resolve => setTimeout(resolve, 3000)); // ✅ Works in all Node.js versions


    // Grab the final URL (after JS redirect and everything)
    const finalUrl = page.url();
    console.log('Final resolved URL:', finalUrl);

    // Clean redirect to the actual resolved URL
    return res.redirect(302, finalUrl);

  } catch (err) {
    console.error('Error resolving final URL:', err.message);
    return res.status(500).send('Failed to resolve final redirect.');
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Final-URL redirector running at http://localhost:${PORT}/go`);
});
