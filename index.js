const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve a JS page that loads the tracking URL and redirects
app.get('/go', (req, res) => {
  const trackingUrl = 'https://admin.rewardoo.com/track/9b235NBDbO7usq_b4Lx2UdgKkLV6jGm88d36ZvJ0M268Z1JhVAohdYDm_bvqTMZMdoGmQKrDP3vbAc?source=inner&url=https%3A%2F%2Fwww.intersport.de%2F';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <meta name="robots" content="noindex, nofollow" />
        <style>
          body { font-family: sans-serif; text-align: center; padding-top: 50px; }
        </style>
      </head>
      <body>
        <p>Hold tight! Taking you to the best Intersport deals...</p>
        <iframe src="${trackingUrl}" style="display:none;" sandbox></iframe>
        <script>
          setTimeout(function() {
            // This is the base final destination (we know it's always Intersport)
            const baseUrl = "https://www.intersport.de/";

            // Optionally pass UTM manually if needed (or use static from tracking)
            const params = new URLSearchParams(window.location.search);
            const iclid = params.get("iclid"); // e.g., if passed from another ad

            const finalUrl = new URL(baseUrl);
            if (iclid) finalUrl.searchParams.set("iclid", iclid);

            // Redirect
            window.location.href = finalUrl.toString();
          }, 2500);
        </script>
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/go`);
});
