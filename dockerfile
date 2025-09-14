# Base con pnpm configurado
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Copiamos todo de una vez
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY pnpm-workspace.yaml ./
COPY database/ ./database/  

# Instalamos dependencias
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build
COPY . .
RUN pnpm run build

RUN mkdir -p /app/dist/sql/queries
COPY src/sql/queries/ /app/dist/sql/queries/

# Verificar que todo está bien
RUN ls -la && ls -la database/

EXPOSE 3000
CMD ["pnpm", "start"]