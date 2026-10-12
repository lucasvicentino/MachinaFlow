FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY machina-core/shared/package*.json ./machina-core/shared/
COPY machina-web/package*.json ./machina-web/

RUN npm install

COPY machina-core/shared ./machina-core/shared
COPY machina-web ./machina-web

RUN npm run build --workspace=@machina/shared
RUN npm run build --workspace=@machina/web

FROM nginx:alpine

COPY --from=builder /app/machina-web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
