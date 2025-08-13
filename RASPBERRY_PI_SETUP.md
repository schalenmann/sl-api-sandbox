# 🍓 Raspberry Pi Deployment Guide

This guide will help you deploy the SL Departure App on a Raspberry Pi so other devices on your local network can access it.

## 📋 Prerequisites

- Raspberry Pi (any model with network connectivity)
- Raspberry Pi OS installed
- Python 3 (usually pre-installed)
- Local network connection (WiFi or Ethernet)

## 🚀 Quick Setup

### 1. **Copy Files to Raspberry Pi**

**Option A: Using SCP (from your computer)**
```bash
# Replace 'pi@raspberrypi.local' with your Pi's address
scp -r sl-api-sandbox/ pi@raspberrypi.local:~/
```

**Option B: Direct download on Pi**
```bash
# SSH into your Pi, then:
cd ~
git clone <your-repo-url> sl-api-sandbox
# OR download and unzip your files
```

**Option C: USB Transfer**
- Copy the `sl-api-sandbox` folder to a USB drive
- Insert USB into Raspberry Pi
- Copy files: `cp -r /media/pi/USB/sl-api-sandbox ~/`

### 2. **Connect to Your Raspberry Pi**

```bash
# SSH into your Raspberry Pi
ssh pi@raspberrypi.local
# OR use the IP address if you know it
ssh pi@192.168.1.100
```

### 3. **Navigate and Start Server**

```bash
cd ~/sl-api-sandbox
python3 server.py
```

### 4. **Access from Other Devices**

The server will display URLs like:
```
🚇 Starting SL Departure App server...
📁 Serving files from: /home/pi/sl-api-sandbox
🌐 Server URLs:
   Local:    http://localhost:8000
   Network:  http://192.168.1.100:8000

📱 Other devices can access: http://192.168.1.100:8000
```

**Use the Network URL on any device on your local network!**

## 🔧 Advanced Configuration

### Custom Port

```bash
# Use a different port if 8000 is busy
python3 server.py 3000
python3 server.py 8080
```

### Run in Background

```bash
# Run server in background
nohup python3 server.py > server.log 2>&1 &

# Check if running
ps aux | grep server.py

# Stop background server
pkill -f server.py
```

### Auto-start on Boot

Create a systemd service:

```bash
# Create service file
sudo nano /etc/systemd/system/sl-departure.service
```

Add this content:
```ini
[Unit]
Description=SL Departure App
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/sl-api-sandbox
ExecStart=/usr/bin/python3 server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
# Enable auto-start
sudo systemctl enable sl-departure.service

# Start now
sudo systemctl start sl-departure.service

# Check status
sudo systemctl status sl-departure.service

# View logs
sudo journalctl -u sl-departure.service -f
```

## 🌐 Network Access

### Find Your Pi's IP Address

```bash
# On the Raspberry Pi
hostname -I

# OR
ip addr show | grep inet
```

### Access from Different Devices

- **Computer:** `http://192.168.1.100:8000`
- **Phone:** `http://192.168.1.100:8000`
- **Tablet:** `http://192.168.1.100:8000`
- **Smart TV:** `http://192.168.1.100:8000`

Replace `192.168.1.100` with your Pi's actual IP address.

## 🔥 Firewall Configuration

If you have firewall issues:

```bash
# Check if ufw is active
sudo ufw status

# Allow port 8000 if needed
sudo ufw allow 8000

# OR disable firewall temporarily
sudo ufw disable
```

## 📱 Mobile-Friendly Features

The app is already responsive and works great on:
- ✅ Smartphones
- ✅ Tablets  
- ✅ Desktop computers
- ✅ Smart TVs with browsers

## 🛠️ Troubleshooting

### Problem: Can't Access from Other Devices

**Check 1: Server binding**
```bash
# Make sure server shows "Network: http://x.x.x.x:8000"
# If it only shows localhost, the server isn't binding to all interfaces
```

**Check 2: Firewall**
```bash
sudo ufw status
sudo ufw allow 8000
```

**Check 3: Network connectivity**
```bash
# From another device, ping the Pi
ping 192.168.1.100
```

### Problem: Port Already in Use

```bash
# Use a different port
python3 server.py 3000

# OR find what's using port 8000
sudo netstat -tulpn | grep :8000
```

### Problem: Server Stops Working

```bash
# Check logs if using systemd
sudo journalctl -u sl-departure.service -f

# Restart service
sudo systemctl restart sl-departure.service
```

## 🔗 Static IP (Optional)

For a permanent setup, configure a static IP:

```bash
# Edit network config
sudo nano /etc/dhcpcd.conf

# Add these lines (adjust for your network):
interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

## 🎯 Performance Tips

- **Use Ethernet** for better stability than WiFi
- **Raspberry Pi 4** recommended for multiple concurrent users
- **SD Card Class 10** for better I/O performance
- **Cooling** recommended if running 24/7

## 📊 Monitoring

Check server status:
```bash
# CPU/Memory usage
htop

# Network connections
sudo netstat -tulpn | grep :8000

# Service logs
sudo journalctl -u sl-departure.service --since "1 hour ago"
```

---

## 🎉 That's It!

Your SL Departure App is now running on your Raspberry Pi and accessible to all devices on your local network! 

**Enjoy real-time Stockholm transport data from anywhere in your home!** 🚇📱
