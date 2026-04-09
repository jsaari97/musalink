# Musalink Monorepo

Share music streaming links across different services.

### Supported Streaming Services

- Spotify
- Deezer

## Structure

This project uses npm workspaces with the standard `packages/*` layout.

### packages/backend

Cloudflare Worker backend service.

### packages/frontend

UI app written in TypeScript and React (Vite).

### packages/common

Shared functions and types used by frontend and backend.

## Development

Install dependencies from the repository root:

```bash
npm ci
```

Run the development environment:

```bash
npm run dev
```

Run checks and builds from the repository root:

```bash
npm run lint
npm run test
npm run build
```

## Environment Variables

### Frontend (`packages/frontend`)

- `VITE_API_URL`: Base URL for the backend Worker API.
- Local file: `packages/frontend/.env`
- Example:

```bash
VITE_API_URL=https://musalink.<your-subdomain>.workers.dev
```

### Backend Worker (`packages/backend`)

- `SPOTIFY_CLIENT_ID`: Spotify API client ID.
- `SPOTIFY_CLIENT_SECRET`: Spotify API client secret.
- Local dev file for Wrangler: `packages/backend/.dev.vars`
- Example:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

For deployed Workers, set these as Cloudflare Worker secrets (via Wrangler or dashboard).

### GitHub Actions Deploy Secrets

Deploying from GitHub Actions requires these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

And this repository variable (not secret):

- `VITE_API_URL`

## License

MIT
