FROM node:16-alpine

ENV HOST 0.0.0.0
ENV PORT 8080

RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY dlasc229vo4thbf
ENV PM2_SECRET_KEY 6r00xp17qi9544z

CMD ["pm2-runtime", "app.js"]

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN ["yarn", "build:api"]

EXPOSE 8080
CMD ["pm2-runtime","dist/apps/api/main.js"]
