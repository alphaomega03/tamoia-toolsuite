FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY nodejs-containers/basic-express/package*.json ./
# ^ different from node.js doc because: https://stackoverflow.com/questions/56605865/cloud-build-not-able-to-find-the-dockerfile
# COPY package*.json ./
# ^ use for local testing (https://nodejs.org/en/docs/guides/nodejs-docker-webapp/#building-your-image) - running this in cloud build results in this error: "COPY failed: no source files were specified"

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY nodejs-containers/basic-express/server.js ./
# ^ different from node.js doc because: https://stackoverflow.com/questions/56605865/cloud-build-not-able-to-find-the-dockerfile

EXPOSE 8080
CMD [ "node", "server.js" ]

# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# ^ checked against gcp official sample, it's the same - https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/main/run/helloworld/Dockerfile