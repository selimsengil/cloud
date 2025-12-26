FROM node:20-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json .
RUN npm install --omit=dev

COPY server.js .

RUN chgrp -R 0 /app && chmod -R g=u /app

USER app

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
