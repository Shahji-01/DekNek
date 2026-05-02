# Use Node.js LTS (Alpine for smaller size)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all source code
COPY . .

# Expose the API port
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
