# Use latest Playwright image with all browsers
FROM mcr.microsoft.com/playwright:latest

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install
RUN npx playwright install

# Copy rest of app
COPY . .

# Expose port
EXPOSE 10000

# Start app
CMD ["node", "server.js"]
