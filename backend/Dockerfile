FROM node:lts-alpine3.23

WORKDIR /app

# Copy package files
COPY package*.json ./


# Install all dependencies (including dev)
RUN npm install

COPY .env ./


# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start with nodemon for hot reload
CMD ["npm", "start", "--", "--host"]