FROM node:21 as builder
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn/

RUN yarn install --immutable
COPY . ./
ARG VERSION=DOCKER_VERSION
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}
RUN sed -i "s|PROD_VERSION|$VERSION|g" src/environments/environment.prod.ts
RUN yarn build
RUN cp /usr/src/app/node_modules/@angular/service-worker/safety-worker.js /usr/src/app/dist/legacy-app/ngsw-worker.js

FROM nginx:1.25.3-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/legacy-app/browser /usr/share/nginx/html
COPY ./.well-kown /usr/share/nginx/html/.well-known
EXPOSE 4000
