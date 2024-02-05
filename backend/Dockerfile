FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y \
    mysql-client \
    nodejs \
    npm

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8800
CMD ["node", "index.js"]
