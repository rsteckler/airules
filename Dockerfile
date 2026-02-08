# Build client
FROM node:20-alpine AS client
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile
COPY client ./client
# Same-origin API when served from this server
ENV VITE_API_URL=
RUN pnpm --filter airules-client run build

# Run server and serve client
FROM node:20-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN pnpm install --frozen-lockfile --prod
COPY server ./server
COPY --from=client /app/client/dist ./client-dist
ENV NODE_ENV=production
ENV SERVED_CLIENT_PATH=/app/client-dist
EXPOSE 3000
CMD ["node", "server/src/index.js"]
