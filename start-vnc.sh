#!/bin/bash
# Start X virtual framebuffer
Xvfb :1 -screen 0 1920x1080x24 &

# Start noVNC web interface
websockify -D 6080 localhost:5900

# Set display for Node/Playwright
export DISPLAY=:1

# Start Node server
npm start
