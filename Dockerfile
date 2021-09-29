FROM node:14
WORKDIR /usr/asyncQueue
COPY package*.json ./
RUN npm install
COPY . .
ENV RABBITMQ_URL=amqp://rabbitmq3
ENV QUEUE_NAME=filesUploadQueue
ENV EXCHANGE_NAME=filesUploadExchange
CMD [ "npm", "start" ]