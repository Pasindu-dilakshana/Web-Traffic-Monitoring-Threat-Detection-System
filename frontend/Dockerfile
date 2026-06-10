# Use Node 20 to fix the "CustomEvent is not defined" error
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (this will install the Linux version of esbuild)
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the Vite development port
EXPOSE 5173

# Run Vite with --host so it is accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]