# Dockerfile
# preferred node version chosen here
FROM node:18-alpine

# Set /frontend as the working directory in container
WORKDIR /frontend

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json ./

# Install dependencies in /app
RUN npm install

# Copy the rest of our Next.js folder into /app
COPY . .

# Ensure port 8080 is accessible to our system
EXPOSE 3000

# Run dev, as we would via the command line
CMD npm run dev