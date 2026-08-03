# Use Node.js LTS image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose application port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"]