FROM node:16 as builder
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn/

RUN yarn
RUN yarn global add @angular/cli
COPY . ./
# If you are building your code for production
# RUN npm ci --only=production
RUN ng build
RUN ng run tumi-events:server

FROM node:16
WORKDIR /root/
# Bundle app source
COPY --from=builder /usr/src/app/dist dist
EXPOSE 4000
CMD [ "node", "dist/tumi-events/server/main.js" ]
