FROM node:24-trixie AS builder

RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/c ./backend/c

RUN cmake -S backend/c -B backend/c/build -DCMAKE_BUILD_TYPE=Release \
    && cmake --build backend/c/build --config Release


FROM node:24-trixie-slim

RUN apt-get update && apt-get install -y \
    libssl3t64 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend/api

COPY backend/api/package*.json ./
RUN npm ci --omit=dev

COPY backend/api/server.mjs ./

COPY --from=builder \
    /app/backend/c/build/lattix \
    /app/backend/c/build/lattix

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "server.mjs"]