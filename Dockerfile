# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .


# Prisma Migrate database client
RUN npx prisma migrate deploy

# Generate Prisma client
RUN npx prisma generate


# Build The app
RUN npm run build

# Expose NestJS default port
EXPOSE 8080

# Start the app
CMD ["npm", "run", "start:prod"]
