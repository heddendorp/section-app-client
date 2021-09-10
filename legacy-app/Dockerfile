FROM node:14

ENV HOST 0.0.0.0
ENV PORT 8080
EXPOSE 8080

WORKDIR /usr/src/app

COPY . .

RUN yarn

CMD ["yarn","start"]
