import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { STATIC_PAGES } from '../src/pages/pageMetadata';
import { AIRLINE_GUIDES } from '../src/data/airlineGuidesData';
import { getPageHtmlContent } from '../src/pages/serverPagesHtml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

async function prerender() {
  const baseIndexPath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(baseIndexPath)) {
    console.warn('[Prerender] dist/index.html does not exist yet. Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(baseIndexPath, 'utf-8');

  // Collect all static routes
  const routes: string[] = [
    // 12 Informational pages
    ...Object.keys(STATIC_PAGES),
    // Directory index
    '/airlines',
    // 3 Intent hubs
    '/baggage-fee-calculator',
    '/tare-weight',
    '/entry-requirements',
    // 42 Airline canonical guides
    ...AIRLINE_GUIDES.map((g) => g.canonicalPath)
  ];

  console.log(`[Prerender] Generating static semantic HTML for ${routes.length} routes...`);

  let successCount = 0;

  for (const route of routes) {
    const pageData = getPageHtmlContent(route);
    if (!pageData) {
      console.warn(`[Prerender] Skipping route without server HTML content: ${route}`);
      continue;
    }

    const { meta, bodyHtml } = pageData;
    let html = baseHtml;

    // Inject title & meta
    html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, `<meta name="description" content="${meta.description}" />`);
    html = html.replace(/<meta\s+name="keywords"\s+content=".*?"\s*\/?>/, `<meta name="keywords" content="${meta.keywords}" />`);
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/, `<meta property="og:title" content="${meta.title}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/, `<meta property="og:description" content="${meta.description}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/, `<meta property="og:url" content="https://gateready.ca${meta.path}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/, `<meta property="og:image" content="https://gateready.ca/thumbnail.jpg" />`);
    html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${meta.title}" />`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${meta.description}" />`);
    html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/, `<meta name="twitter:image" content="https://gateready.ca/thumbnail.jpg" />`);
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/, `<link rel="canonical" href="https://gateready.ca${meta.path}" />`);

    const isAirlineGuide = meta.path.startsWith('/airlines/');
    const breadcrumbItems = isAirlineGuide
      ? [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gateready.ca/' },
          { '@type': 'ListItem', position: 2, name: 'Airline Baggage Guides', item: 'https://gateready.ca/airlines' },
          { '@type': 'ListItem', position: 3, name: meta.heading, item: `https://gateready.ca${meta.path}` }
        ]
      : [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://gateready.ca/' },
          { '@type': 'ListItem', position: 2, name: meta.heading, item: `https://gateready.ca${meta.path}` }
        ];

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': meta.schemaType || 'WebPage',
      name: meta.title,
      headline: meta.heading,
      description: meta.description,
      keywords: meta.keywords,
      url: `https://gateready.ca${meta.path}`,
      publisher: {
        '@type': 'Organization',
        name: 'CSM App Holdings',
        url: 'https://gateready.ca',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'csmappholdings@gmail.com',
          contactType: 'customer support'
        }
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      }
    };

    html = html.replace(
      '</head>',
      `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n  </head>`
    );

    // Inject semantic body content into #root
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>/,
      `<div id="root">${bodyHtml}</div>`
    );

    // Determine target directory and write index.html
    const targetDir = path.join(distDir, route.replace(/^\//, ''));
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
    successCount++;
  }

  // Generate static redirect files for alias URLs
  for (const guide of AIRLINE_GUIDES) {
    for (const alias of guide.aliases) {
      const aliasDir = path.join(distDir, 'airlines', alias);
      fs.mkdirSync(aliasDir, { recursive: true });
      const redirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Redirecting to ${guide.title}...</title>
  <meta http-equiv="refresh" content="0; url=https://gateready.ca${guide.canonicalPath}">
  <link rel="canonical" href="https://gateready.ca${guide.canonicalPath}">
  <script>window.location.replace("https://gateready.ca${guide.canonicalPath}");</script>
</head>
<body>
  <p>Redirecting to <a href="https://gateready.ca${guide.canonicalPath}">${guide.name} Baggage Allowance</a>...</p>
</body>
</html>`;
      fs.writeFileSync(path.join(aliasDir, 'index.html'), redirectHtml, 'utf-8');
    }
  }

  console.log(`[Prerender] Successfully generated ${successCount} prerendered pages and alias redirects.`);
}

prerender().catch((err) => {
  console.error('[Prerender Error]', err);
  process.exit(1);
});
