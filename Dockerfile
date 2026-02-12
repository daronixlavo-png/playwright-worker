FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Kolkata

RUN apt update && apt install -y \
    curl gnupg unzip git python3 python3-pip wget \
    xfce4 xfce4-goodies x11vnc xvfb novnc websockify \
    libgtk-4-1 libgraphene-1.0-0 libxslt1.1 libevent-2.1-7 \
    gstreamer1.0-plugins-base gstreamer1.0-gl gstreamer1.0-plugins-good \
    flite libavif13 libharfbuzz-icu0 libhyphen0 tzdata && \
    apt clean

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs && \
    node -v && npm -v

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /root/.vnc && x11vnc -storepasswd 1234 /root/.vnc/passwd

EXPOSE 3000 5900 6080

CMD ["sh", "-c", "Xvfb :1 -screen 0 1024x768x16 & export DISPLAY=:1 & xfce4-session & x11vnc -display :1 -forever -usepw -rfbport 5900 & websockify --web=/usr/share/novnc/ 6080 localhost:5900 & node server.js"]
