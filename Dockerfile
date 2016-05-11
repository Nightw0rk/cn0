FROM node:4.4-wheezy
WORKDIR /app
ADD ./ /app
RUN npm install --production
ENTRYPOINT ["node","bin/www.js"]