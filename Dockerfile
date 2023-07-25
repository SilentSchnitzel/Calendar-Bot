# Use the official RabbitMQ base image from Docker Hub
FROM rabbitmq:management
FROM node:18

#Expose RabbitMQ ports
EXPOSE 5672
EXPOSE 15672

# Set the working directory
WORKDIR /Calendar-Bot

#Copy the package.json and other package-lock.json items into the container
COPY package*.json ./

#install dependencies
RUN npm install

#copy all appplication files to the container
COPY . .

CMD [ "node", "main.js" ]