FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm install tsx typescript --save-dev && npm run build

# Create data directory
RUN mkdir -p /data

ENV NODE_ENV=production
ENV DB_PATH=/data/recipes.db

EXPOSE 3000
CMD ["node", "dist/index.js"]
