FROM node:4
COPY ./ /app
WORKDIR /app
RUN npm install bower -g && bower install --allow-root
EXPOSE 80
ENTRYPOINT ["node","server.js","80"]