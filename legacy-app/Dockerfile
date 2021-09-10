FROM node:14

ENV HOST 0.0.0.0
ENV PORT 8080

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN ["yarn", "build:api"]

EXPOSE 8080
CMD ["yarn","start"]
