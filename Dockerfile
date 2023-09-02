FROM node:16
ARG node_env=dev
ENV NODE_ENV=dev

WORKDIR /app

RUN npm install -g @nestjs/cli@8.2.8

RUN npm install -g ts-node

COPY package*.json ./
RUN npm ci

COPY ./ ./
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
