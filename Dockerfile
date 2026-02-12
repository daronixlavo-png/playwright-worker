FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Kolkata

# Install required packages
RUN apt update && \
    apt install -y curl gnupg unzip git python3 python3-pip wget \
                   xfce4 xfce4-goodies x11vnc xvfb novnc websockify \
                   libgtk-4-1 libgraphene-1.0-0 libxslt1.1 libevent-2.1-7 \
                   gstreamer1.0-plugins-base gstreamer1.0-gl gstreamer1.0-plugins-good \
                   flite libavif13 libharfbuzz-icu0 libhyphen0 libgles2 tzdata \
                   && apt clean

# Node.js install
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs

# App setup
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Add start-vnc.sh and give execute permission
COPY start-vnc.sh /app/start-vnc.sh
RUN chmod +x /app/start-vnc.sh

# Expose NoVNC port
EXPOSE 6080

# Start server
CMD ["/app/start-vnc.sh"]
