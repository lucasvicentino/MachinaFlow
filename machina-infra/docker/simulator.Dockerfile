FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY machina-infra/simulator/package*.json ./machina-infra/simulator/

RUN npm install

COPY machina-infra/simulator ./machina-infra/simulator

RUN npm run build --workspace=@machina/simulator

EXPOSE 5020

CMD ["npm", "start", "--workspace=@machina/simulator"]
