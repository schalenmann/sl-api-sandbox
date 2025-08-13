# Svedmyra Tunnelbana Departure App

A simple web application that displays real-time departure information from Svedmyra Tunnelbana station towards T-Centralen using the SL API.

## Features

- 🚇 Shows next 4 departures towards T-Centralen
- ⏱️ Displays minutes until departure and departure time
- 🔄 Auto-refresh every minute
- 📱 Manual refresh button
- 💻 Responsive design for mobile and desktop
- 🎨 Modern, clean user interface

## Quick Start

### 🚀 **Method 1: Using the Included Server (Recommended)**

1. **Clone or download** this repository
2. **Open Terminal/Command Prompt** and navigate to the project folder:
   ```bash
   cd /path/to/sl-api-sandbox
   ```
3. **Start the local server**:
   ```bash
   python3 server.py
   ```
4. **Open your browser** and go to:
   ```
   http://localhost:8000
   ```
5. **Enjoy!** The app will automatically fetch real-time SL data

### 🛠️ **Method 2: Using Other Servers**

If you prefer different tools or the Python server doesn't work:

```bash
# Python built-in server
python3 -m http.server 8000
# Then open: http://localhost:8000

# Node.js http-server (install with: npm install -g http-server)
npx http-server
# Then open: http://localhost:8080

# PHP built-in server
php -S localhost:8000
# Then open: http://localhost:8000
```

### ⚠️ **Important: Don't Open index.html Directly**

**❌ This won't work:**
- Double-clicking `index.html`
- Opening `file:///path/to/index.html` in browser

**✅ This will work:**
- Using any HTTP server: `http://localhost:8000`

**Why?** Browsers block API calls from `file://` URLs due to CORS security policies.

## 🔧 Troubleshooting

### Problem: "Port 8000 is already in use"

**Solution 1: Stop existing server**
- Look for other terminal windows running servers
- Press `Ctrl+C` in any terminal running a server
- Try starting the server again

**Solution 2: Use a different port**
```bash
# Try port 3000
python3 -m http.server 3000
# Then open: http://localhost:3000

# Try port 8080
python3 -m http.server 8080
# Then open: http://localhost:8080
```

### Problem: "Command not found: python3"

**On Windows:**
```bash
python server.py
# OR
py server.py
```

**On macOS/Linux:**
```bash
python3 server.py
```

### Problem: API Error Messages

If you see funny error messages in the app:
1. ✅ **This is normal!** The app shows humorous errors when SL API is temporarily unavailable
2. 🔄 **Wait a moment** and try the refresh button
3. 🕐 **Auto-refresh** will try again in 60 seconds
4. 📱 Check [SL Service Status](https://status.sl.se/) for known issues

### Problem: No Departures Shown

1. **Check the time** - Late night/early morning may have fewer departures
2. **Try manual refresh** - Click the refresh button
3. **Check SL service** - Weekend schedules may be different
4. **Real-time delays** - Sometimes trains are delayed or cancelled

## Real-Time SL Data

The app fetches live departure data directly from the SL API:

- **No API key required** - The SL Transport API allows direct access
- **Real-time updates** - Shows actual departure times from Svedmyra station
- **Error handling** - Clear error messages if the SL API is unavailable
- **CORS ready** - Configured to work with cross-origin API calls

Simply open the app and it will connect to the live SL data automatically!

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and responsive design
- `app.js` - JavaScript application logic and SL API integration
- `README.md` - This documentation file

## Technical Details

- **Station**: Svedmyra (Site ID: 9165)
- **Direction**: Towards T-Centralen (via Hässelby strand route)
- **API**: SL Transport API (no API key required)
- **Update Frequency**: Every 60 seconds
- **Cache**: 30 seconds to optimize performance
- **Error Handling**: Clear error messages when SL API is unavailable

## Browser Support

Works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The app is built with vanilla HTML, CSS, and JavaScript - no build process required!

### 🛠️ Development Setup

1. **Required Tools:**
   - Any modern web browser (Chrome, Firefox, Safari, Edge)
   - Python 3.x (for the included server) OR Node.js OR PHP

2. **Start Development Server:**
   ```bash
   # Using the included Python server (recommended)
   python3 server.py
   
   # OR using Python's built-in server
   python3 -m http.server 8000
   
   # OR using Node.js
   npx http-server
   
   # OR using PHP
   php -S localhost:8000
   ```

3. **Access the App:**
   - Open browser to `http://localhost:8000`
   - Make changes to HTML/CSS/JS files
   - Refresh browser to see changes

## 🍓 Raspberry Pi Deployment

Want to host this on your local network for all devices to access? 

**👉 See [RASPBERRY_PI_SETUP.md](RASPBERRY_PI_SETUP.md) for complete deployment instructions!**

Perfect for:
- 📱 Family dashboard on phones/tablets
- 🖥️ Kitchen display computer  
- 📺 Smart TV browser
- 🏠 Home automation integration

### 📁 Project Structure

```
sl-api-sandbox/
├── index.html              # Main HTML file
├── styles.css              # All styling and responsive design
├── app.js                 # JavaScript application logic
├── server.py              # Network-ready server
├── README.md              # Documentation (this file)
├── RASPBERRY_PI_SETUP.md  # Raspberry Pi deployment guide
└── about.md               # Original project requirements
```

### 🔧 Development Tips

- **Live Editing:** Changes to HTML/CSS/JS are reflected immediately on browser refresh
- **API Testing:** Use browser DevTools (F12) → Network tab to see API calls
- **Console Logs:** Check browser console for helpful debug messages
- **Mobile Testing:** Use DevTools device emulation or test on real mobile devices

## API Information

This app uses the SL (Stockholm Public Transport) API to provide real-time departure information for Stockholm's public transport system.

- **API Documentation**: https://www.trafiklab.se/api/our-apis/sl/
- **Access**: No API key required for basic usage
- **Data Format**: JSON responses with departure times and delays
- **Error Handling**: Clear error messages when API is unavailable

## License

This project is open source and available under the MIT License.
