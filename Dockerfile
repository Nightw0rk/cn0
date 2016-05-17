FROM node:4
COPY ./ /app
WORKDIR /app
RUN npm install
EXPOSE 2080
ENTRYPOINT ["node","bin/www.js"]
