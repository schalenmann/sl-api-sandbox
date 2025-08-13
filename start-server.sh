#!/bin/bash

# SL Departure App - Network Server Startup Script
# Usage: ./start-server.sh [port]

# Default port
PORT=${1:-8000}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚇 SL Departure App - Network Server${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed or not in PATH${NC}"
    echo -e "${YELLOW}💡 Please install Python 3 first${NC}"
    exit 1
fi

# Check if port is available
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ Port $PORT is already in use${NC}"
    echo -e "${YELLOW}💡 Try a different port: ./start-server.sh $(($PORT + 1))${NC}"
    exit 1
fi

# Get local IP address
LOCAL_IP=$(python3 -c "
import socket
try:
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(('8.8.8.8', 80))
        print(s.getsockname()[0])
except:
    print('127.0.0.1')
")

echo -e "${GREEN}✅ Starting SL Departure App server...${NC}"
echo -e "${BLUE}📍 Port: $PORT${NC}"
echo -e "${BLUE}🌐 Local access: http://localhost:$PORT${NC}"
echo -e "${GREEN}🌐 Network access: http://$LOCAL_IP:$PORT${NC}"
echo ""
echo -e "${YELLOW}📱 Share this URL with other devices: http://$LOCAL_IP:$PORT${NC}"
echo ""
echo -e "${BLUE}⏹️  Press Ctrl+C to stop the server${NC}"
echo ""

# Start the server
python3 server.py $PORT
