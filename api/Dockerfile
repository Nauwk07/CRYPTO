FROM node:lts-alpine

WORKDIR /app

# Install app dependencies
COPY package.json .
RUN npm install && npm install -g ts-node && npm install node-gyp -g && npm rebuild bcrypt 

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
