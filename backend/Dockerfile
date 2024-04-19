# Use the official Node.js 14 LTS image as a base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files from the local directory to the working directory in the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of the backend source code to the working directory in the container
COPY . .

# Expose the port that the backend server listens on
EXPOSE 5000

# Define the command to start the backend server
CMD ["node", "server.js"]
