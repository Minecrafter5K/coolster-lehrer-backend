FROM node:20-alpine

WORKDIR /app


COPY . .

RUN npm i
RUN npm run build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER node

EXPOSE 3001

CMD ["node", "./dist/src/main.js"]
