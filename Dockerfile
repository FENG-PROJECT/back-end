FROM node:12.13.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

RUN npm install tapable@1.1.3
RUN npm install @types/webpack@4.41.27

COPY . .

RUN npm install --save glob

RUN npm run build

FROM node:12.13.0-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]