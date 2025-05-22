# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads/profiles

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"] 