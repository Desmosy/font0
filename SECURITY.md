# Security Policy

## Supported Versions

This project is pre-release. Security fixes should target the `main` branch
unless maintainers publish versioned releases later.

## API Keys

Font Generator uses a bring-your-own-key model. `NVIDIA_API_KEY` belongs only in
server-side configuration:

- `.env.local` for local development
- hosting provider secret storage for deployments
- CI secrets only when a workflow truly needs them

Never put provider keys in:

- `NEXT_PUBLIC_*` variables
- client components
- committed `.env` files
- screenshots
- public issues or pull requests
- browser-visible configuration

If a key is exposed, revoke it and create a new one immediately.

## Reporting Vulnerabilities

Please report security issues privately instead of opening a public issue.

Include:

- short description
- reproduction steps
- affected commit or release
- expected impact
- logs with secrets removed

## Deployment Notes

`/api/generate` includes request size limits, a local fallback, upstream timeout
configuration, and basic in-memory rate limiting.

For public production deployments, also configure:

- provider spending limits
- hosting-platform secret storage
- platform-level rate limiting or WAF rules
- log scrubbing for authorization headers

The built-in rate limiter is not a replacement for production traffic controls.
