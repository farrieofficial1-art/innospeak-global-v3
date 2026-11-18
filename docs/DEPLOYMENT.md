# Deployment and Security Notes

## Scope

This document is host-agnostic. It does not configure or deploy to a production host.
The currently selected provisional public origin is recorded in `src/config/site.js`; the final production host must be confirmed before launch.

## SPA routing

Configure the chosen host to serve `dist/index.html` for application routes that do not resolve to a static file.
Static assets under `dist/assets/`, `robots.txt`, `sitemap.xml`, `favicon.svg` and `og-default.svg` must remain directly resolvable.
The host should not rewrite `robots.txt`, `sitemap.xml` or asset URLs to `index.html`.

## Preview environments

Preview deployments should set `X-Robots-Tag: noindex, nofollow`.
Preview deployments must not use the production canonical domain or production-only analytics identifiers.
No preview origin should replace the production `SITE_ORIGIN` constant.

## Draft security headers

Recommended headers:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)`
- `X-Content-Type-Options: nosniff`

## Draft Content Security Policy

Use a restrictive CSP and test it before enabling enforcement:

```text
default-src 'self';
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
form-action 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://*.supabase.co https://api.safaricom.co.ke https://sandbox.safaricom.co.ke https://api-m.paypal.com https://api-m.sandbox.paypal.com;
worker-src 'self' blob:;
frame-src https://www.paypal.com https://sandbox.paypal.com
```

This policy permits the application, Supabase, configured PayPal domains, Safaricom payment domains and Google Fonts.
Do not add `*`, broad wildcard script sources, or `script-src 'unsafe-eval'`.
Framer Motion and normal Vite output should work under this policy; inline script/style support may need browser verification.
Analytics or new third-party integrations require a separate, explicit CSP update and consent implementation.
Deploy CSP initially in report-only mode if the host supports CSP reporting.

## Environment variables

Browser variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Server and Edge Function secrets must remain outside browser bundles:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `MPESA_ENV`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_BASE_URL`
- `RESEND_API_KEY`
- `GEMINI_API_KEY`

Do not expose server-only secrets through `VITE_*` variables or client-side code.

## Host verification

After selecting a final host, verify:

- HTTPS and HSTS
- SPA fallback
- `robots.txt` and `sitemap.xml`
- canonical domain
- favicon and Open Graph assets
- CSP report or enforcement
- security headers
- Supabase allowed origins
- payment callback domains
