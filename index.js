const express = require('express');
const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

const TRACKING_URL = 'https://admin.rewardoo.com/track/9b235NBDbO7usq_b4Lx2UdgKkLV6jGm88d36ZvJ0M268Z1JhVAohdYDm_bvqTMZMdoGmQKrDP3vbAc?source=inner&url=https%3A%2F%2Fwww.intersport.de%2F';

app.get('/go', async (req, res) => {
  let browser;

  try {
  const chromePath = '/usr/bin/google-chrome';



    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent(req.headers['user-agent'] || 'Mozilla/5.0');
    await page.goto(TRACKING_URL, { waitUntil: 'networkidle2', timeout: 15000 });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const finalUrl = page.url();
    console.log('✅ Final Resolved URL:', finalUrl);

    return res.redirect(302, finalUrl);

  } catch (err) {
    console.error('❌ Error resolving final URL:', err.message);
    return res.status(500).send('Error resolving final redirect.');
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/go`);
});
