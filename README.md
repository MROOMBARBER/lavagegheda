# ALLO LAVAGE — Casablanca

Cinematic, responsive, zero-build mobile car wash website. **French** content, animated hero, dynamic prices, responsive menus, mobile-friendly WhatsApp reservation, accessible FAQ and local SEO.

## Preview locally

Open \`index.html\` directly, or use a static server:

\`\`\`bash
python3 -m http.server 8080
\`\`\`

Then visit http://localhost:8080.

## Publish on Vercel

Import this GitHub repository in Vercel. Select **Other** framework, leave Build Command empty and set Output Directory to the project root (\`.\`) if requested. Production starts at \`index.html\`. Do not replace an existing live domain until the preview is approved.

## Customize before launch

Edit **\`script.js\`** → **\`CONFIG\`**:

- \`whatsapp\`: phone number in international format, digits only (currently **212661389143**; verify that this is the correct number for ALLO LAVAGE).
- \`prices.citadine\` and \`prices.suv\`: indicative rates in MAD.
- Service labels and confirmation message can be edited in the \`bookingMessage\` function.

Edit **\`index.html\`** for editorial content and JSON-LD phone. The sample rates are **indicative** and require owner confirmation. Images from Unsplash are illustrative; they are not actual before/after photos, and the website does not claim otherwise. Brand names visible in third-party car imagery are not endorsements.

When a real domain is known, set \`<link rel="canonical">\`, \`og:url\`, and a sitemap (and add the URL to \`robots.txt\`). Confirm legal company details before adding legal notices. Avoid fabricated customer reviews, certifications, response-time promises or claims about availability.

## Tech

Pure HTML / CSS / JavaScript. No paid backend, no analytics tracking, no customer data stored on this site, no build, no secret keys, mobile-first. Google Fonts and Unsplash image CDN require internet access. Reduced-motion accessibility supported.

Built for GitHub → Vercel deployment.
