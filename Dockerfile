# Base image
FROM ubuntu:22.04

# Non-interactive mode for apt
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Kolkata
ENV DISPLAY=:1

# Install dependencies
RUN apt update && \
    apt install -y curl gnupg unzip git python3 python3-pip wget \
                   xfce4 xfce4-goodies x11vnc xvfb novnc websockify \
                   libgtk-4-1 libgraphene-1.0-0 libxslt1.1 libevent-2.1-7 \
                   gstreamer1.0-plugins-base gstreamer1.0-gl gstreamer1.0-plugins-good \
                   flite libavif13 libharfbuzz-icu0 libhyphen0 libgles2 tzdata && \
    apt clean

# Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install Node packages
RUN npm install

# Install Playwright browsers
RUN npx playwright install

# Copy app files
COPY . .

# Make start-vnc.sh executable
RUN chmod +x /app/start-vnc.sh

# Expose NoVNC port
EXPOSE 6080

# Command to start VNC + automation server
CMD ["/app/start-vnc.sh"]
