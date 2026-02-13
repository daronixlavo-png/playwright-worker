# Base image with Playwright and browsers pre-installed
FROM mcr.microsoft.com/playwright:latest

# Set working directory
WORKDIR /app

# Copy only package.json (package-lock.json optional)
COPY package.json ./

# Install dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install

# Copy all app files
COPY . ./

# Expose port for server
EXPOSE 10000

# Start server
CMD ["node", "server.js"]
