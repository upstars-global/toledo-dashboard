# toledo-dashboard

Dashboard for Toledo service. Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Project configuration

### Prerequisites

The following tools are required for local development:

- install [Node.js](https://nodejs.org/en/download/):
  - follow the link above and select the installation option that suits you best.
  - required version: v22.12.0 or above
- install [pnpm](https://pnpm.io/installation)

### Installation

```bash
# clone project
git clone git@github.com:upstars-global/toledo-dashboard.git

# install dependencies
pnpm install

# prepare env variables for front
cp .env.example .env
```

### Environment variables

Common:

- `NODE_ENV` — usually `development`
- `NUXT_HOST` — app host (default: `localhost`)
- `NUXT_PORT` / `PORT` — app port (default: `5000`)
- `DEVTOOLS` - enable devtools (default: `false`)
- `SSR_ENABLE` - enable server-side rendering (default: `true`)

Config:

- `NUXT_SESSION_PASSWORD` - session password
- `NUXT_OAUTH_GOOGLE_CLIENT_ID` - google oauth client id
- `NUXT_OAUTH_GOOGLE_CLIENT_SECRET` - google oauth client secret
- `NUXT_OAUTH_GITHUB_CLIENT_ID` - github oauth client id
- `NUXT_OAUTH_GITHUB_CLIENT_SECRET` - github oauth client secret
- `ALLOW_EMAIL_HOSTS` - list of allowed email hosts
- `ALLOW_GITHUB_COMPANIES` - list of allowed github companies

### Run app in development mode

```bash
pnpm run dev

# open http://localhost:5000
```

### Run app in production mode

```bash
# first build server
pnpm run build
# run server
pnpm run preview

# open http://localhost:3000
```
