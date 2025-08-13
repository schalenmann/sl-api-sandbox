#!/usr/bin/env python3
"""
Simple HTTP server for the SL Departure App
Can serve locally or on local network for Raspberry Pi deployment
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import socket

# Configuration
DEFAULT_PORT = 8000
HOST = '0.0.0.0'  # Bind to all interfaces for network access

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow API calls
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def get_local_ip():
    """Get the local IP address of this machine"""
    try:
        # Connect to a remote address to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"

def main():
    # Allow port to be specified as command line argument
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"❌ Invalid port number: {sys.argv[1]}")
            sys.exit(1)
    
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    local_ip = get_local_ip()
    
    print(f"🚇 Starting SL Departure App server...")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"🌐 Server URLs:")
    print(f"   Local:    http://localhost:{port}")
    print(f"   Network:  http://{local_ip}:{port}")
    print(f"")
    print(f"📱 Other devices can access: http://{local_ip}:{port}")
    print(f"⏹️  Press Ctrl+C to stop the server")
    print(f"")
    
    # Only open browser if running on desktop (not on headless Raspberry Pi)
    if os.environ.get('DISPLAY') or sys.platform == 'darwin' or sys.platform == 'win32':
        print(f"🌐 Opening browser...")
        webbrowser.open(f'http://localhost:{port}')
    
    try:
        with socketserver.TCPServer((HOST, port), CustomHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Address already in use
            print(f"❌ Port {port} is already in use!")
            print(f"💡 Try a different port: python3 server.py {port + 1}")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
