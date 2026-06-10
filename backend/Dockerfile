# Use Node 20 for better compatibility with modern packages
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of your backend source code
COPY . .

# Unlock port 5000 for the API
EXPOSE 5000

# The command to start your Node.js server
CMD ["node", "src/server.js"]