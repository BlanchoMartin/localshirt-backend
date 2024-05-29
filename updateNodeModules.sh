#!/bin/bash

rm -rf server/node_modules server/yarn.lock web-app/node_modules web-app/package-lock.json extension/node_modules extension/package-lock.json image-ai/node_modules image-ai/package-lock.json
cd server
yarn install
cd ../web-app
npm i
cd ../extension
npm i
cd ../image-ai
npm i
cd ..