# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0-appservice

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

RUN apt-get update && \
    apt-get install -y ghostscript graphicsmagick

COPY . /home/site/wwwroot

COPY package.json /home/site/wwwroot
COPY function.json /home/site/wwwroot/converter
COPY main.js /home/site/wwwroot/converter

RUN cd /home/site/wwwroot && \
    npm install
