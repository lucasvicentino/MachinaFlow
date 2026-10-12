FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY machina-core/shared/package*.json ./machina-core/shared/
COPY machina-core/package*.json ./machina-core/

RUN npm install

COPY machina-core ./machina-core

RUN npm run build --workspace=@machina/shared
RUN npm run build --workspace=@machina/core

EXPOSE 3001

CMD ["npm", "start", "--workspace=@machina/core"]
