FROM node:20-alpine as base

WORKDIR /app

ARG LABEL_API_PORT

ENV LABEL_API_PORT=$LABEL_API_PORT

COPY package*.json ./
RUN npm install

COPY . .

FROM base as prod
EXPOSE 28469
CMD ["npm", "run", "dev"]

FROM base as test
CMD ["npm", "run", "test"]
