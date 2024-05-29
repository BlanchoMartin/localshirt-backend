###################
# BUILD FOR LOCAL DEVELOPMENT
# this step install all the dependencies needed for the server app
###################

FROM node:18-alpine As development

RUN apk add --no-cache chromium

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN yarn install

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
# this step build the app using the previous installed dependecies
###################

FROM node:18-alpine As build

ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

# Installation de MailHog
RUN apt-get update && \
    apt-get install -y \
        mailhog

# Port sur lequel MailHog écoute les emails entrants
ENV MH_SMTP_BIND_ADDR=0.0.0.0:1025

# Port d'accès à l'interface Web MailHog
ENV MH_HTTP_BIND_ADDR=0.0.0.0:8025

USER node

###################
# PRODUCTION
# this step run the app using the previous build
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]