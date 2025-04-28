FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=development

# Expose port
EXPOSE 80

# Start application in development mode
CMD ["npm", "start"]