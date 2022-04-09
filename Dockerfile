FROM node:16-alpine

LABEL MAINTAINER="Niskii <psychoniskii2@gmail.com>"
RUN apk update && apk add git ca-certificates

RUN apk update; \
    apk upgrade; 

WORKDIR /app

RUN adduser -s /bin/sh -D suki

RUN apk add --no-cache git
COPY . .
RUN yarn
RUN yarn lint
RUN yarn cache clean

USER suki

CMD [ "yarn", "dev" ]