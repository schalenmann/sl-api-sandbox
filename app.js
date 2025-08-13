class SLDepartureApp {
    constructor() {
        // SL API configuration - Using new SL Transport API (no API key needed)
        this.SITE_ID = '9165'; // Svedmyra station site ID (correct)
        this.API_URL = 'https://transport.integration.sl.se/v1/sites';
        
        // Cache for API calls to avoid hitting rate limits
        this.cache = {
            data: null,
            timestamp: null,
            ttl: 30000 // 30 seconds cache
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDepartures();
        this.startAutoRefresh();
    }

    bindEvents() {
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn.addEventListener('click', () => {
            this.loadDepartures(true);
        });
    }

    startAutoRefresh() {
        // Refresh every minute (60000ms)
        setInterval(() => {
            this.loadDepartures();
        }, 60000);
    }

    async loadDepartures(forceRefresh = false) {
        this.showLoading();
        
        try {
            // Check cache first
            if (!forceRefresh && this.isCacheValid()) {
                this.displayDepartures(this.cache.data);
                return;
            }

            const response = await this.fetchDepartures();
            
            // New API format doesn't have StatusCode, just check if we have departures
            this.cache.data = response;
            this.cache.timestamp = Date.now();
            this.displayDepartures(response);
        } catch (error) {
            console.error('Error loading departures:', error);
            this.showError(error.message);
        }
    }

    isCacheValid() {
        return this.cache.data && 
               this.cache.timestamp && 
               (Date.now() - this.cache.timestamp) < this.cache.ttl;
    }

    async fetchDepartures() {
        const url = `${this.API_URL}/${this.SITE_ID}/departures`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`SL API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // The new API format doesn't use StatusCode, check if data exists
        if (!data || !data.departures) {
            throw new Error('No departure data received from SL API');
        }
        
        return data;
    }



    displayDepartures(data) {
        const departuresList = document.getElementById('departures-list');
        const loadingEl = document.getElementById('loading');
        const errorEl = document.getElementById('error');

        // Hide loading and error
        loadingEl.classList.add('hidden');
        errorEl.classList.add('hidden');

        // Clear previous departures
        departuresList.innerHTML = '';

        // Get metro departures towards T-Centralen
        // From Svedmyra, trains going to "Hässelby strand" pass through T-Centralen
        const departures = data.departures || [];
        const toCentralen = departures
            .filter(departure => {
                // Metro trains (line 19) going towards Hässelby strand pass through T-Centralen
                return departure.line?.transport_mode === 'METRO' && 
                       (departure.destination?.includes('Hässelby') || 
                        departure.destination?.includes('T-Centralen') ||
                        departure.destination?.includes('Centralen') ||
                        departure.direction?.includes('Hässelby'));
            })
            .slice(0, 4); // Show only next 4 departures

        if (toCentralen.length === 0) {
            this.showFunnyNoDataMessage();
        } else {
            toCentralen.forEach(departure => {
                const departureEl = this.createDepartureElement(departure);
                departuresList.appendChild(departureEl);
            });
        }

        // Show departures list and update timestamp
        departuresList.classList.remove('hidden');
        this.updateLastUpdatedTime();
    }

    createDepartureElement(departure) {
        const div = document.createElement('div');
        div.className = 'departure-item';

        const minutesLeft = this.calculateMinutesLeft(departure);
        const departureTime = this.formatDepartureTime(departure);
        const lineNumber = departure.line?.designation || departure.LineNumber || 'Unknown';
        const destination = departure.destination || departure.Destination || 'Unknown';

        div.innerHTML = `
            <div class="departure-info">
                <div class="line-info">Line ${lineNumber}</div>
                <div class="destination">→ ${destination}</div>
            </div>
            <div class="time-info">
                <div class="minutes-left">${minutesLeft}</div>
                <div class="departure-time">${departureTime}</div>
            </div>
        `;

        return div;
    }

    calculateMinutesLeft(departure) {
        // New API format uses 'display' field
        if (departure.display) {
            return departure.display;
        }

        if (departure.DisplayTime) {
            return departure.DisplayTime;
        }

        // Calculate from expected time if display not available
        const expectedTime = departure.expected || departure.ExpectedDateTime;
        if (expectedTime) {
            const now = new Date();
            const departureTime = new Date(expectedTime);
            const diffMs = departureTime - now;
            const diffMins = Math.max(0, Math.round(diffMs / 60000));
            
            if (diffMins === 0) {
                return 'Nu';
            } else if (diffMins === 1) {
                return '1 min';
            } else {
                return `${diffMins} min`;
            }
        }

        return 'Unknown';
    }

    formatDepartureTime(departure) {
        // New API format uses 'expected' field
        const expectedTime = departure.expected || departure.ExpectedDateTime;
        if (expectedTime) {
            const time = new Date(expectedTime);
            return time.toLocaleTimeString('sv-SE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        return '';
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('departures-list').classList.add('hidden');
        document.getElementById('error').classList.add('hidden');
    }

    showFunnyNoDataMessage() {
        const departuresList = document.getElementById('departures-list');
        
        const funnyMessages = [
            "🚇 The trains have decided to play hide and seek! No departures to T-Centralen found right now.",
            "🤔 Looks like all the trains took a coffee break. Try again in a moment!",
            "🎭 Plot twist: The trains are currently rehearsing for a musical. No departures available!",
            "🐌 The trains are moving so slowly they've become invisible. Zero departures detected!",
            "🎪 Welcome to the mystery hour - where trains vanish into thin air! No T-Centralen departures found.",
            "🕵️ The case of the missing trains! All departures to T-Centralen have mysteriously disappeared.",
            "🎨 The trains are currently being painted by invisible artists. Please wait for the masterpiece!",
            "🧙‍♂️ A wizard has temporarily made all T-Centralen trains disappear. Magic wearing off soon!",
            "🎲 You rolled a natural 1 - no train departures available! Better luck next refresh.",
            "🚀 The trains have been upgraded to rocket ships and flew away! Traditional departures unavailable."
        ];
        
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        
        departuresList.innerHTML = `
            <div class="no-departures">
                <div class="funny-message">${randomMessage}</div>
                <div class="try-again">
                    <p>🔄 Try refreshing in a moment, or check if SL is having technical difficulties.</p>
                    <p>📱 The app will auto-refresh in a minute anyway!</p>
                </div>
            </div>
        `;
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        const errorDetails = document.getElementById('error-details');
        
        // Add some humor to API errors too
        const funnyApiErrors = [
            "🤖 The SL robots are having a tea party and forgot to send us data!",
            "🌐 The internet tubes are clogged with digital tumbleweeds!",
            "📡 Our satellites are playing cosmic hide and seek with SL's servers!",
            "🔌 Someone tripped over the internet cable at SL headquarters!",
            "🐛 The API bugs have formed a union and gone on strike!"
        ];
        
        const randomApiError = funnyApiErrors[Math.floor(Math.random() * funnyApiErrors.length)];
        
        errorDetails.innerHTML = `
            <div class="funny-error">${randomApiError}</div>
            <div class="technical-error">Technical details: ${message}</div>
        `;
        
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('departures-list').classList.add('hidden');
        errorEl.classList.remove('hidden');
    }

    updateLastUpdatedTime() {
        const lastUpdatedEl = document.getElementById('last-updated-time');
        const now = new Date();
        lastUpdatedEl.textContent = now.toLocaleTimeString('sv-SE');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SLDepartureApp();
});

// Show app status message
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.querySelector('.departure-item')) {
            console.log('🚇 SL Departure App loaded successfully!');
            console.log('📡 Fetching real-time data from SL API (no API key required)');
            console.log('✨ Data refreshes automatically every minute');
        }
    }, 1000);
});
