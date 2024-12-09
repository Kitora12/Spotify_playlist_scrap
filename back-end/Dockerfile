FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY src/views /app/dist/views

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
