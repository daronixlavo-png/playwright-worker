# Use latest stable Playwright image
FROM mcr.microsoft.com/playwright:latest

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npx playwright install

# Copy all app files
COPY . ./

# Ensure start script is executable
RUN chmod +x /app/start-vnc.sh

# Expose port for API
EXPOSE 10000

# Default command
CMD ["npm", "start"]
