# Base image with Playwright and browsers
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Copy only package.json (lock file optional)
COPY package.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the repo
COPY . ./

# Expose server port
EXPOSE 10000

# Start the server
CMD ["npm", "start"]
