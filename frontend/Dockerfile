# Use the official Node.js 14 LTS image as a base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files from the local directory to the working directory in the container
COPY package.json yarn.lock ./

# Install dependencies in the container
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend source code to the working directory in the container
COPY . .

# Build the React application
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose the port that the frontend server listens on
EXPOSE 80

# Define the command to serve the React application using serve on port 80
CMD ["serve", "-s", "build", "-l", "80"]
