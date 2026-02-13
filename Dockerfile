# Base image updated to latest Playwright with browsers
FROM mcr.microsoft.com/playwright:v1.58.2-focal

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

# Expose port for web (if using VNC / API)
EXPOSE 10000

# Default command
CMD ["npm", "start"]
