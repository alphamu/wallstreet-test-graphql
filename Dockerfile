FROM node:12-buster

RUN ls -al
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY client/package*.json ./client/
COPY backend/package*.json ./backend/

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

WORKDIR /usr/src/app/client
RUN npm clean-install && npm audit fix && npm run build
WORKDIR /usr/src/app/backend
RUN npm clean-install && npm audit fix

EXPOSE 5000
CMD [ "npm", "start" ]