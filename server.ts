import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getPageHtmlContent } from './src/pages/serverPagesHtml';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Runtime Environment requires dev server on port 3000 (nginx listens on 8080 and proxies to 3000)
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Cached reusable test account for Ethereal fallback when no live SMTP / Resend key is provided
let cachedTestAccount: any = null;

async function getTestTransporter() {
  if (!cachedTestAccount) {
    cachedTestAccount = await nodemailer.createTestAccount();
    console.log('[EmailService] Created test mailbox:', cachedTestAccount.user);
  }
  return nodemailer.createTransport({
    host: cachedTestAccount.smtp.host,
    port: cachedTestAccount.smtp.port,
    secure: cachedTestAccount.smtp.secure,
    auth: {
      user: cachedTestAccount.user,
      pass: cachedTestAccount.pass
    }
  });
}

// API Route: Send Packing List
app.post('/api/send-packing-list', async (req: Request, res: Response) => {
  try {
    const { email, tripName, formattedText, formattedHtml } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    const cleanEmail = email.trim();
    const cleanTripName = (tripName || 'Your Travel Trip').trim();
    const subject = `Your GateReady Packing List — ${cleanTripName}`;
    const sender = process.env.SENDER_EMAIL || 'GateReady <onboarding@resend.dev>';

    // 1. Check for Resend API Key
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: sender,
            to: [cleanEmail],
            subject,
            html: formattedHtml || `<pre>${formattedText}</pre>`,
            text: formattedText || 'Your GateReady Packing List'
          })
        });

        if (resendResp.ok) {
          const resendData = await resendResp.json();
          return res.json({
            success: true,
            provider: 'resend',
            id: resendData.id,
            message: `Packing list sent to ${cleanEmail}`
          });
        } else {
          const errText = await resendResp.text();
          console.warn('[Resend API Error]', errText);
        }
      } catch (err) {
        console.warn('[Resend Exception]', err);
      }
    }

    // 2. Check for SendGrid API Key
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgResp = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: cleanEmail }] }],
            from: { email: process.env.SENDGRID_FROM_EMAIL || 'manifest@gateready.ca', name: 'GateReady' },
            subject,
            content: [
              { type: 'text/plain', value: formattedText || 'Your GateReady Packing List' },
              { type: 'text/html', value: formattedHtml || `<pre>${formattedText}</pre>` }
            ]
          })
        });

        if (sgResp.status === 202 || sgResp.ok) {
          return res.json({
            success: true,
            provider: 'sendgrid',
            message: `Packing list sent to ${cleanEmail}`
          });
        }
      } catch (err) {
        console.warn('[SendGrid Exception]', err);
      }
    }

    // 3. Check for Custom SMTP Host
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: sender,
        to: cleanEmail,
        subject,
        text: formattedText,
        html: formattedHtml || `<pre>${formattedText}</pre>`
      });

      return res.json({
        success: true,
        provider: 'smtp',
        messageId: info.messageId,
        message: `Packing list sent to ${cleanEmail}`
      });
    }

    // 4. Reliable Real Test Mailer (Ethereal Email)
    const testTransporter = await getTestTransporter();
    const info = await testTransporter.sendMail({
      from: sender,
      to: cleanEmail,
      subject,
      text: formattedText,
      html: formattedHtml || `<pre>${formattedText}</pre>`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[Email Sent] Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[Email Delivered Viewable URL]: ${previewUrl}`);
    }

    return res.json({
      success: true,
      provider: 'test-delivery',
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
      message: `Packing list sent to ${cleanEmail}`
    });
  } catch (error: any) {
    console.error('Failed to dispatch email:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send packing list email'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  let viteDevServer: any = null;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    viteDevServer = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
  }

  // Explicit route for robots.txt
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsPath = path.resolve(__dirname, 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain');
      return res.sendFile(robotsPath);
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send("User-agent: *\nAllow: /\nSitemap: https://gateready.ca/sitemap.xml\n");
  });

  // Explicit route for sitemap.xml
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml');
      return res.sendFile(sitemapPath);
    }
    res.status(404).send('Not Found');
  });

  // Pre-rendered HTML routes for all 12 trust, compliance, and legal pages
  const STATIC_PAGE_ROUTES = [
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/faq',
    '/pricing',
    '/how-it-works',
    '/cookies',
    '/refunds',
    '/changelog',
    '/security',
    '/reviews'
  ];

  STATIC_PAGE_ROUTES.forEach((routePath) => {
    app.get([routePath, `${routePath}/`], async (req: Request, res: Response, next) => {
      try {
        const pageData = getPageHtmlContent(routePath);
        if (!pageData) {
          return next();
        }

        const { meta, bodyHtml } = pageData;
        const indexPath = isProduction
          ? path.resolve(__dirname, 'dist', 'index.html')
          : path.resolve(__dirname, 'index.html');

        if (!fs.existsSync(indexPath)) {
          return next();
        }

        let template = fs.readFileSync(indexPath, 'utf-8');

        // Inject page metadata
        template = template.replace(
          /<title>.*?<\/title>/,
          `<title>${meta.title}</title>`
        );
        template = template.replace(
          /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
          `<meta name="description" content="${meta.description}" />`
        );
        template = template.replace(
          /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/,
          `<meta name="keywords" content="${meta.keywords}" />`
        );
        template = template.replace(
          /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/,
          `<meta property="og:title" content="${meta.title}" />`
        );
        template = template.replace(
          /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/,
          `<meta property="og:description" content="${meta.description}" />`
        );
        template = template.replace(
          /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/,
          `<meta property="og:url" content="https://gateready.ca${meta.path}" />`
        );
        template = template.replace(
          /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/,
          `<meta name="twitter:title" content="${meta.title}" />`
        );
        template = template.replace(
          /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/,
          `<meta name="twitter:description" content="${meta.description}" />`
        );
        template = template.replace(
          /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/,
          `<link rel="canonical" href="https://gateready.ca${meta.path}" />`
        );

        // Inject page-specific JSON-LD structured data for rich snippets
        const pageStructuredData = {
          '@context': 'https://schema.org',
          '@type': meta.schemaType || 'WebPage',
          'name': meta.title,
          'headline': meta.heading,
          'description': meta.description,
          'keywords': meta.keywords,
          'url': `https://gateready.ca${meta.path}`,
          'publisher': {
            '@type': 'Organization',
            'name': 'CSM App Holdings',
            'url': 'https://gateready.ca',
            'contactPoint': {
              '@type': 'ContactPoint',
              'email': 'csmappholdings@gmail.com',
              'contactType': 'customer support'
            }
          },
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://gateready.ca/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': meta.heading,
                'item': `https://gateready.ca${meta.path}`
              }
            ]
          }
        };

        template = template.replace(
          '</head>',
          `<script type="application/ld+json">${JSON.stringify(pageStructuredData)}</script>\n  </head>`
        );

        // Inject pre-rendered semantic HTML inside #root
        template = template.replace(
          /<div id="root">[\s\S]*?<\/div>/,
          `<div id="root">${bodyHtml}</div>`
        );

        if (!isProduction && viteDevServer) {
          template = await viteDevServer.transformIndexHtml(req.originalUrl, template);
        }

        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(template);
      } catch (e) {
        next(e);
      }
    });
  });

  if (!isProduction && viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GateReady server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start GateReady server:', err);
  process.exit(1);
});
