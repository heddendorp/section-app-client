FROM node:20.5 as builder
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn/

RUN yarn install --immutable
COPY . ./
ARG VERSION=DOCKER_VERSION
ARG CONFIGURATION=production
RUN sed -i "s|PROD_VERSION|$VERSION|g" src/environments/environment.prod.ts
RUN yarn build --configuration $CONFIGURATION

FROM nginx:1.25.2-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/legacy-app /usr/share/nginx/html
COPY ./.well-kown /usr/share/nginx/html/.well-known
EXPOSE 4000
