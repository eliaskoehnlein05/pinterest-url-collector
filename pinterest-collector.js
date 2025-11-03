// ==================== SETTINGS ====================
const CONFIG = {
    stepX: 80,           
    stepY: 10,           
    pauseX: 80,          
    pauseY: 300,         
    waveEnabled: true,        
    waveType: 'sine',         
    waveAmplitude: 100,       
    waveFrequency: 0.02,      
    mouseSize: 20,       
    mouseColor: 'lime',  
    showTrail: true,     
    startFromTop: true,  
    autoDownload: false, 
    maxScrolls: 500,     
    noNewUrlsLimit: 5,
    blockedDomains: ['instagram.com']  // NEW: Blocked domains
};

const PRESETS = {
    turbo: {
        stepX: 150, stepY: 20, pauseX: 50, pauseY: 200,
        waveAmplitude: 80, waveFrequency: 0.03,
        name: '🚀 TURBO'
    },
    fast: {
        stepX: 100, stepY: 15, pauseX: 60, pauseY: 250,
        waveAmplitude: 100, waveFrequency: 0.02,
        name: '⚡ FAST'
    },
    normal: {
        stepX: 80, stepY: 10, pauseX: 80, pauseY: 300,
        waveAmplitude: 100, waveFrequency: 0.02,
        name: '✅ NORMAL'
    },
    precise: {
        stepX: 50, stepY: 8, pauseX: 100, pauseY: 400,
        waveAmplitude: 120, waveFrequency: 0.015,
        name: '🎯 PRECISE'
    },
    ultra: {
        stepX: 30, stepY: 5, pauseX: 150, pauseY: 500,
        waveAmplitude: 150, waveFrequency: 0.01,
        name: '🔬 ULTRA'
    }
};

// ==================== UI CREATION ====================
let controlPanel = null;
let statsInterval = null;

function createUI() {
    if (controlPanel) return;
    
    controlPanel = document.createElement('div');
    controlPanel.id = 'pinterest-collector-ui';
    controlPanel.innerHTML = `
        <style>
            #pinterest-collector-ui {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 340px;
                background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
                border: 2px solid #00ff88;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 255, 136, 0.3);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                z-index: 999999;
                color: white;
                user-select: none;
                backdrop-filter: blur(10px);
                max-height: 90vh;
                overflow-y: auto;
            }
            
            #pinterest-collector-ui::-webkit-scrollbar {
                width: 8px;
            }
            
            #pinterest-collector-ui::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.2);
                border-radius: 10px;
            }
            
            #pinterest-collector-ui::-webkit-scrollbar-thumb {
                background: #00ff88;
                border-radius: 10px;
            }
            
            #pinterest-collector-ui.minimized {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
            }
            
            #pinterest-collector-ui.minimized .pc-content {
                display: none;
            }
            
            .pc-header {
                background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
                padding: 12px 15px;
                border-radius: 13px 13px 0 0;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: sticky;
                top: 0;
                z-index: 10;
            }
            
            #pinterest-collector-ui.minimized .pc-header {
                border-radius: 50%;
                padding: 18px;
                cursor: pointer;
            }
            
            .pc-title {
                font-weight: bold;
                font-size: 16px;
                color: #1e1e2e;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            #pinterest-collector-ui.minimized .pc-title {
                font-size: 24px;
            }
            
            .pc-minimize {
                background: rgba(0,0,0,0.2);
                border: none;
                color: #1e1e2e;
                width: 24px;
                height: 24px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                line-height: 1;
            }
            
            .pc-minimize:hover {
                background: rgba(0,0,0,0.3);
            }
            
            #pinterest-collector-ui.minimized .pc-minimize {
                display: none;
            }
            
            .pc-content {
                padding: 15px;
            }
            
            .pc-stats {
                background: rgba(0, 255, 136, 0.1);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 15px;
                border: 1px solid rgba(0, 255, 136, 0.3);
            }
            
            .pc-stat-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 13px;
            }
            
            .pc-stat-row:last-child {
                margin-bottom: 0;
            }
            
            .pc-stat-label {
                color: #aaa;
            }
            
            .pc-stat-value {
                color: #00ff88;
                font-weight: bold;
            }
            
            .pc-progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(0,0,0,0.3);
                border-radius: 3px;
                overflow: hidden;
                margin-top: 8px;
            }
            
            .pc-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00ff88 0%, #00cc6a 100%);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .pc-last-url {
                background: rgba(0, 136, 255, 0.1);
                border: 1px solid rgba(0, 136, 255, 0.3);
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 15px;
                font-size: 11px;
            }
            
            .pc-last-url-title {
                color: #8888ff;
                font-weight: bold;
                margin-bottom: 5px;
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 1px;
            }
            
            .pc-last-url-content {
                color: #aaa;
                word-break: break-all;
                line-height: 1.4;
            }
            
            .pc-section {
                margin-bottom: 15px;
            }
            
            .pc-section-title {
                font-size: 12px;
                color: #888;
                text-transform: uppercase;
                margin-bottom: 8px;
                font-weight: 600;
                letter-spacing: 1px;
            }
            
            .pc-button-group {
                display: flex;
                gap: 8px;
                margin-bottom: 10px;
            }
            
            .pc-button {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                transition: all 0.2s;
                color: white;
            }
            
            .pc-button:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            .pc-button:active:not(:disabled) {
                transform: translateY(0);
            }
            
            .pc-button.start {
                background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
                color: #1e1e2e;
            }
            
            .pc-button.stop {
                background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
            }
            
            .pc-button.pause {
                background: linear-gradient(135deg, #ffaa00 0%, #ff8800 100%);
            }
            
            .pc-button.export {
                background: linear-gradient(135deg, #4488ff 0%, #2266dd 100%);
            }
            
            .pc-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .pc-select {
                width: 100%;
                padding: 10px;
                border: 2px solid rgba(0, 255, 136, 0.3);
                border-radius: 8px;
                background: rgba(0, 255, 136, 0.05);
                color: white;
                font-size: 13px;
                cursor: pointer;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .pc-select:focus {
                outline: none;
                border-color: #00ff88;
                background: rgba(0, 255, 136, 0.1);
            }
            
            .pc-select option {
                background: #2a2a3e;
                color: white;
            }
            
            .pc-slider-container {
                margin-bottom: 12px;
            }
            
            .pc-slider-label {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 12px;
                color: #aaa;
            }
            
            .pc-slider-value {
                color: #00ff88;
                font-weight: bold;
            }
            
            .pc-slider {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: rgba(0, 255, 136, 0.2);
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            
            .pc-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #00ff88;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            }
            
            .pc-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #00ff88;
                cursor: pointer;
                border: none;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            }
            
            .pc-status-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                border-radius: 8px;
                background: rgba(0,0,0,0.2);
                font-size: 12px;
                font-weight: 600;
            }
            
            .pc-status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            .pc-status-dot.stopped {
                background: #ff4444;
            }
            
            .pc-status-dot.running {
                background: #00ff88;
            }
            
            .pc-status-dot.paused {
                background: #ffaa00;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .pc-blocked-domains {
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                border-radius: 8px;
                padding: 10px;
                font-size: 11px;
            }
            
            .pc-blocked-title {
                color: #ff8888;
                font-weight: bold;
                margin-bottom: 6px;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .pc-domain-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            
            .pc-domain-tag {
                background: rgba(255, 68, 68, 0.2);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 10px;
                color: #ffaaaa;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .pc-domain-remove {
                cursor: pointer;
                font-weight: bold;
                color: #ff4444;
            }
            
            .pc-domain-remove:hover {
                color: #ff6666;
            }
            
            .pc-domain-input {
                width: 100%;
                padding: 8px;
                border: 2px solid rgba(255, 68, 68, 0.3);
                border-radius: 6px;
                background: rgba(0,0,0,0.2);
                color: white;
                font-size: 12px;
                margin-top: 6px;
            }
            
            .pc-domain-input:focus {
                outline: none;
                border-color: #ff4444;
            }
            
            .pc-footer {
                padding: 10px 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
                font-size: 11px;
                color: #666;
                text-align: center;
            }
        </style>
        
        <div class="pc-header">
            <div class="pc-title">
                🚜 <span>Collector</span>
            </div>
            <button class="pc-minimize" id="pc-minimize-btn">−</button>
        </div>
        
        <div class="pc-content">
            <div class="pc-stats">
                <div class="pc-stat-row">
                    <span class="pc-stat-label">URLs Collected</span>
                    <span class="pc-stat-value" id="pc-url-count">0</span>
                </div>
                <div class="pc-stat-row">
                    <span class="pc-stat-label">Time Elapsed</span>
                    <span class="pc-stat-value" id="pc-time-elapsed">00:00</span>
                </div>
                <div class="pc-stat-row">
                    <span class="pc-stat-label">Status</span>
                    <div class="pc-status-indicator">
                        <div class="pc-status-dot stopped" id="pc-status-dot"></div>
                        <span id="pc-status-text">Ready</span>
                    </div>
                </div>
                <div class="pc-progress-bar">
                    <div class="pc-progress-fill" id="pc-progress-fill"></div>
                </div>
            </div>
            
            <div class="pc-last-url" id="pc-last-url-container" style="display: none;">
                <div class="pc-last-url-title">🔗 Last Found URL</div>
                <div class="pc-last-url-content" id="pc-last-url-text">—</div>
            </div>
            
            <div class="pc-section">
                <div class="pc-section-title">Controls</div>
                <div class="pc-button-group">
                    <button class="pc-button start" id="pc-start-btn">▶ Start</button>
                    <button class="pc-button pause" id="pc-pause-btn" disabled>⏸ Pause</button>
                    <button class="pc-button stop" id="pc-stop-btn" disabled>⏹ Stop</button>
                </div>
                <button class="pc-button export" id="pc-export-btn" disabled>💾 Export URLs</button>
            </div>
            
            <div class="pc-section">
                <div class="pc-section-title">Speed Preset</div>
                <select class="pc-select" id="pc-preset-select">
                    <option value="turbo">🚀 TURBO - Very Fast</option>
                    <option value="fast" selected>⚡ FAST - Recommended</option>
                    <option value="normal">✅ NORMAL - Balanced</option>
                    <option value="precise">🎯 PRECISE - Thorough</option>
                    <option value="ultra">🔬 ULTRA - Maximum</option>
                </select>
            </div>
            
            <div class="pc-section">
                <div class="pc-section-title">Wave Pattern</div>
                <select class="pc-select" id="pc-wave-select">
                    <option value="sine" selected>〰️ Sine - Smooth Wave</option>
                    <option value="triangle">/\\/\\ Triangle - Zigzag</option>
                    <option value="random">⚡ Random - Chaotic</option>
                    <option value="double">〰〰 Double - More Waves</option>
                    <option value="none">━━ None - Straight</option>
                </select>
                
                <div class="pc-slider-container">
                    <div class="pc-slider-label">
                        <span>Wave Amplitude</span>
                        <span class="pc-slider-value" id="pc-amplitude-value">100px</span>
                    </div>
                    <input type="range" min="20" max="200" value="100" class="pc-slider" id="pc-amplitude-slider">
                </div>
                
                <div class="pc-slider-container">
                    <div class="pc-slider-label">
                        <span>Wave Frequency</span>
                        <span class="pc-slider-value" id="pc-frequency-value">0.02</span>
                    </div>
                    <input type="range" min="5" max="50" value="20" class="pc-slider" id="pc-frequency-slider">
                </div>
            </div>
            
            <div class="pc-section">
                <div class="pc-section-title">Domain Filter</div>
                <div class="pc-blocked-domains">
                    <div class="pc-blocked-title">🚫 Blocked Domains</div>
                    <div class="pc-domain-tags" id="pc-blocked-tags"></div>
                    <input type="text" class="pc-domain-input" id="pc-domain-input" placeholder="Add domain (e.g., instagram.com)">
                </div>
            </div>
        </div>
        
        <div class="pc-footer">
            Pinterest URL Collector v6.0 Final
        </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    // Add event listeners
    document.getElementById('pc-minimize-btn').addEventListener('click', toggleMinimize);
    document.getElementById('pc-start-btn').addEventListener('click', uiStart);
    document.getElementById('pc-pause-btn').addEventListener('click', uiPause);
    document.getElementById('pc-stop-btn').addEventListener('click', uiStop);
    document.getElementById('pc-export-btn').addEventListener('click', uiExport);
    document.getElementById('pc-preset-select').addEventListener('change', (e) => uiSetPreset(e.target.value));
    document.getElementById('pc-wave-select').addEventListener('change', (e) => uiSetWave(e.target.value));
    
    // Sliders
    document.getElementById('pc-amplitude-slider').addEventListener('input', (e) => {
        CONFIG.waveAmplitude = parseInt(e.target.value);
        document.getElementById('pc-amplitude-value').textContent = CONFIG.waveAmplitude + 'px';
    });
    
    document.getElementById('pc-frequency-slider').addEventListener('input', (e) => {
        CONFIG.waveFrequency = parseInt(e.target.value) / 1000;
        document.getElementById('pc-frequency-value').textContent = CONFIG.waveFrequency.toFixed(3);
    });
    
    // Domain input
    document.getElementById('pc-domain-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let domain = e.target.value.trim().toLowerCase();
            if (domain && !CONFIG.blockedDomains.includes(domain)) {
                CONFIG.blockedDomains.push(domain);
                updateBlockedDomainsTags();
                e.target.value = '';
                console.log(`%c🚫 Blocked: ${domain}`, 'color: orange; font-weight: bold');
            }
        }
    });
    
    updateBlockedDomainsTags();
    makeDraggable(controlPanel);
    startStatsUpdate();
}

function updateBlockedDomainsTags() {
    let container = document.getElementById('pc-blocked-tags');
    container.innerHTML = '';
    
    CONFIG.blockedDomains.forEach(domain => {
        let tag = document.createElement('div');
        tag.className = 'pc-domain-tag';
        tag.innerHTML = `
            ${domain}
            <span class="pc-domain-remove" data-domain="${domain}">×</span>
        `;
        
        tag.querySelector('.pc-domain-remove').addEventListener('click', (e) => {
            let domainToRemove = e.target.getAttribute('data-domain');
            CONFIG.blockedDomains = CONFIG.blockedDomains.filter(d => d !== domainToRemove);
            updateBlockedDomainsTags();
            console.log(`%c✅ Unblocked: ${domainToRemove}`, 'color: lime; font-weight: bold');
        });
        
        container.appendChild(tag);
    });
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let header = element.querySelector('.pc-header');
    
    header.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        if (element.classList.contains('minimized')) {
            toggleMinimize();
            return;
        }
        
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.right = "auto";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function startStatsUpdate() {
    if (statsInterval) clearInterval(statsInterval);
    
    statsInterval = setInterval(() => {
        document.getElementById('pc-url-count').textContent = collectedUrls.size;
        
        if (stats.startTime) {
            let elapsed = Math.floor((Date.now() - stats.startTime) / 1000);
            let minutes = Math.floor(elapsed / 60);
            let seconds = elapsed % 60;
            document.getElementById('pc-time-elapsed').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Progress bar
        if (isRunning && document.body.scrollHeight > 0) {
            let progress = (window.scrollY / document.body.scrollHeight) * 100;
            document.getElementById('pc-progress-fill').style.width = Math.min(progress, 100) + '%';
        }
        
        let statusDot = document.getElementById('pc-status-dot');
        let statusText = document.getElementById('pc-status-text');
        
        statusDot.className = 'pc-status-dot';
        if (isRunning) {
            if (isPaused) {
                statusDot.classList.add('paused');
                statusText.textContent = 'Paused';
            } else {
                statusDot.classList.add('running');
                statusText.textContent = 'Running';
            }
        } else {
            statusDot.classList.add('stopped');
            statusText.textContent = collectedUrls.size > 0 ? 'Finished' : 'Ready';
        }
        
        document.getElementById('pc-start-btn').disabled = isRunning;
        document.getElementById('pc-pause-btn').disabled = !isRunning;
        document.getElementById('pc-stop-btn').disabled = !isRunning;
        document.getElementById('pc-export-btn').disabled = collectedUrls.size === 0;
        
        if (isPaused) {
            document.getElementById('pc-pause-btn').textContent = '▶ Resume';
        } else {
            document.getElementById('pc-pause-btn').textContent = '⏸ Pause';
        }
    }, 100);
}

function updateLastURL(url) {
    let container = document.getElementById('pc-last-url-container');
    let text = document.getElementById('pc-last-url-text');
    
    container.style.display = 'block';
    text.textContent = url;
    
    // Flash animation
    container.style.animation = 'none';
    setTimeout(() => {
        container.style.animation = 'flash 0.5s ease';
    }, 10);
}

function removeUI() {
    if (controlPanel) {
        controlPanel.remove();
        controlPanel = null;
    }
    if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
    }
}

window.toggleMinimize = function() {
    if (!controlPanel) return;
    controlPanel.classList.toggle('minimized');
};

// ==================== UI CONTROLS ====================
window.uiStart = function() {
    start();
};

window.uiPause = function() {
    pause();
};

window.uiStop = function() {
    stop();
};

window.uiExport = function() {
    downloadResults();
};

window.uiSetPreset = function(presetName) {
    setPreset(presetName);
    // Update sliders
    document.getElementById('pc-amplitude-slider').value = CONFIG.waveAmplitude;
    document.getElementById('pc-amplitude-value').textContent = CONFIG.waveAmplitude + 'px';
    document.getElementById('pc-frequency-slider').value = CONFIG.waveFrequency * 1000;
    document.getElementById('pc-frequency-value').textContent = CONFIG.waveFrequency.toFixed(3);
};

window.uiSetWave = function(waveType) {
    setWave(waveType);
};

// ==================== WAVE FUNCTIONS ====================
function calculateWaveY(x, baseY, waveCounter) {
    if (!CONFIG.waveEnabled || CONFIG.waveType === 'none') {
        return baseY;
    }
    
    let offset = 0;
    
    switch(CONFIG.waveType) {
        case 'sine':
            offset = Math.sin(waveCounter * CONFIG.waveFrequency) * CONFIG.waveAmplitude;
            break;
        case 'triangle':
            let t = (waveCounter * CONFIG.waveFrequency) % (Math.PI * 2);
            offset = (2 * CONFIG.waveAmplitude / Math.PI) * Math.asin(Math.sin(t));
            break;
        case 'random':
            offset = (Math.random() - 0.5) * CONFIG.waveAmplitude * 2;
            break;
        case 'double':
            offset = Math.sin(waveCounter * CONFIG.waveFrequency * 2) * CONFIG.waveAmplitude;
            break;
    }
    
    return baseY + offset;
}

function isDomainBlocked(url) {
    try {
        let hostname = new URL(url).hostname.toLowerCase();
        return CONFIG.blockedDomains.some(blocked => 
            hostname.includes(blocked.toLowerCase())
        );
    } catch(e) {
        return false;
    }
}

// ==================== MAIN CODE ====================
let collectedUrls = new Set();
let isRunning = false;
let isPaused = false;
let mouseIndicator = null;
let trail = [];
let stats = {
    startTime: null,
    rows: 0,
    scrollDistance: 0
};

function createMouseIndicator() {
    mouseIndicator = document.createElement('div');
    mouseIndicator.style.cssText = `
        position: fixed;
        width: ${CONFIG.mouseSize}px;
        height: ${CONFIG.mouseSize}px;
        background: ${CONFIG.mouseColor};
        border: 3px solid black;
        border-radius: 50%;
        pointer-events: none;
        z-index: 999998;
        transition: all 0.05s ease;
        box-shadow: 0 0 15px ${CONFIG.mouseColor}, 0 0 30px ${CONFIG.mouseColor};
    `;
    document.body.appendChild(mouseIndicator);
}

function addTrailDot(x, y) {
    if (!CONFIG.showTrail) return;
    
    let dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        width: 5px;
        height: 5px;
        background: ${CONFIG.mouseColor};
        border-radius: 50%;
        pointer-events: none;
        z-index: 999997;
        left: ${x}px;
        top: ${y}px;
        opacity: 0.5;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
    
    if (trail.length > 80) {
        let old = trail.shift();
        old.remove();
    }
}

function clearTrail() {
    trail.forEach(dot => dot.remove());
    trail = [];
}

function moveMouse(x, y) {
    if (mouseIndicator) {
        mouseIndicator.style.left = x + 'px';
        mouseIndicator.style.top = y + 'px';
    }
    
    addTrailDot(x, y);
    
    let element = document.elementFromPoint(x, y);
    
    if (element) {
        let event = new MouseEvent('mouseover', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(event);
        
        let link = element.closest('a');
        if (link && link.href && link.href.startsWith('http')) {
            let url = link.href;
            
            if (!url.includes('pinterest.com') && !url.includes('pinimg.com')) {
                // Check if domain is blocked
                if (isDomainBlocked(url)) {
                    return; // Skip blocked domains
                }
                
                if (!collectedUrls.has(url)) {
                    collectedUrls.add(url);
                    
                    link.style.outline = '4px solid ' + CONFIG.mouseColor;
                    link.style.outlineOffset = '2px';
                    setTimeout(() => {
                        link.style.outline = '';
                    }, 1000);
                    
                    console.log(`%c✓ ${collectedUrls.size}`, 'color: lime; font-weight: bold', url);
                    updateLastURL(url);
                }
            }
        }
    }
}

async function rasenmäher() {
    if (isRunning) {
        console.log('⚠️ Already running!');
        return;
    }
    
    isRunning = true;
    isPaused = false;
    stats.startTime = Date.now();
    stats.rows = 0;
    stats.scrollDistance = 0;
    
    createMouseIndicator();
    
    let scrollY = 0;
    let direction = 1;
    let baseMouseY = window.innerHeight / 2;
    let waveCounter = 0;
    let noNewUrlsCount = 0;
    let lastUrlCount = 0;
    
    console.log(`%c🚜 LAWNMOWER STARTED`, 'color: lime; font-size: 20px; font-weight: bold');
    console.log(`%cMode: ${getCurrentPresetName()}`, 'color: cyan; font-size: 14px');
    console.log(`%cWave: ${CONFIG.waveEnabled ? CONFIG.waveType + ' (' + CONFIG.waveAmplitude + 'px)' : 'OFF'}`, 'color: yellow');
    console.log(`%cBlocked: ${CONFIG.blockedDomains.join(', ')}`, 'color: orange');
    
    if (CONFIG.startFromTop) {
        window.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    while (isRunning) {
        while (isPaused && isRunning) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (!isRunning) break;
        
        let windowWidth = window.innerWidth - 100;
        let startX = direction === 1 ? 50 : windowWidth;
        let endX = direction === 1 ? windowWidth : 50;
        
        stats.rows++;
        
        let waveIcon = CONFIG.waveEnabled ? '〰️' : '━';
        console.log(`%c${waveIcon} Row ${stats.rows} ${direction === 1 ? '→' : '←'} | Scroll: ${scrollY}px | URLs: ${collectedUrls.size}`, 
                    'color: ' + (direction === 1 ? 'cyan' : 'magenta') + '; font-weight: bold');
        
        for (let x = startX; 
             direction === 1 ? x <= endX : x >= endX; 
             x += CONFIG.stepX * direction) {
            
            if (!isRunning) break;
            
            while (isPaused && isRunning) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            let mouseY = calculateWaveY(x, baseMouseY, waveCounter);
            waveCounter++;
            
            mouseY = Math.max(50, Math.min(window.innerHeight - 50, mouseY));
            
            moveMouse(x, mouseY);
            await new Promise(resolve => setTimeout(resolve, CONFIG.pauseX));
        }
        
        direction *= -1;
        
        scrollY += CONFIG.stepY;
        stats.scrollDistance += CONFIG.stepY;
        window.scrollTo({ top: scrollY, behavior: 'auto' });
        await new Promise(resolve => setTimeout(resolve, CONFIG.pauseY));
        
        if (collectedUrls.size === lastUrlCount) {
            noNewUrlsCount++;
        } else {
            noNewUrlsCount = 0;
        }
        lastUrlCount = collectedUrls.size;
        
        if (scrollY >= document.body.scrollHeight && noNewUrlsCount >= CONFIG.noNewUrlsLimit) {
            console.log('%c🎉 FINISHED! End reached!', 'color: gold; font-size: 20px; font-weight: bold');
            break;
        }
        
        if (stats.rows >= CONFIG.maxScrolls) {
            console.log('%c⚠️ Max scrolls reached', 'color: orange');
            break;
        }
    }
    
    cleanup();
    showFinalResults();
    
    if (CONFIG.autoDownload && collectedUrls.size > 0) {
        downloadResults();
    }
}

function cleanup() {
    if (mouseIndicator) {
        mouseIndicator.remove();
        mouseIndicator = null;
    }
    clearTrail();
    isRunning = false;
    isPaused = false;
}

function getCurrentPresetName() {
    for (let key in PRESETS) {
        let preset = PRESETS[key];
        if (preset.stepX === CONFIG.stepX && preset.pauseX === CONFIG.pauseX) {
            return preset.name;
        }
    }
    return '🔧 CUSTOM';
}

function showFinalResults() {
    let duration = ((Date.now() - stats.startTime) / 1000 / 60).toFixed(1);
    let urlsPerMin = (collectedUrls.size / duration).toFixed(1);
    
    console.log('\n' + '='.repeat(70));
    console.log('%c🎯 FINAL STATISTICS', 'color: yellow; font-size: 22px; font-weight: bold');
    console.log('='.repeat(70));
    console.log(`%c✅ URLs collected: ${collectedUrls.size}`, 'color: lime; font-size: 18px; font-weight: bold');
    console.log(`%c⏱️  Duration: ${duration} minutes (${urlsPerMin} URLs/min)`, 'color: cyan; font-size: 14px');
    console.log(`%c📏 Rows: ${stats.rows} | Scroll distance: ${stats.scrollDistance}px`, 'color: gray');
    console.log(`%c〰️  Wave: ${CONFIG.waveEnabled ? CONFIG.waveType + ' (' + CONFIG.waveAmplitude + 'px)' : 'OFF'}`, 'color: yellow');
    console.log('='.repeat(70));
    
    let domains = {};
    collectedUrls.forEach(url => {
        try {
            let domain = new URL(url).hostname.replace('www.', '');
            domains[domain] = (domains[domain] || 0) + 1;
        } catch(e) {}
    });
    
    console.log('\n%c📊 Top 15 Domains:', 'font-size: 16px; font-weight: bold; text-decoration: underline');
    Object.entries(domains)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .forEach(([domain, count], i) => {
            let bar = '█'.repeat(Math.min(count, 30));
            console.log(`%c${(i+1).toString().padStart(2)}. ${domain.padEnd(35)} %c${count.toString().padStart(3)} %c${bar}`, 
                       'color: white', 'color: orange; font-weight: bold', 'color: lime');
        });
    
    console.log('\n' + '='.repeat(70));
    console.log('%c📋 ALL URLs:', 'font-size: 16px; font-weight: bold');
    console.log('='.repeat(70));
    console.log(Array.from(collectedUrls).join('\n'));
    console.log('\n' + '='.repeat(70));
}

// ==================== CONTROLS ====================
window.start = function() {
    if (!controlPanel) createUI();
    collectedUrls.clear();
    rasenmäher();
};

window.stop = function() {
    isRunning = false;
    cleanup();
    console.log('%c⏹️ STOPPED', 'color: red; font-size: 18px; font-weight: bold');
    if (collectedUrls.size > 0) showFinalResults();
};

window.pause = function() {
    if (!isRunning) {
        console.log('⚠️ Not started!');
        return;
    }
    isPaused = !isPaused;
    console.log(isPaused ? '%c⏸️ PAUSED' : '%c▶️ RESUMED', 
                isPaused ? 'color: orange; font-size: 16px' : 'color: lime; font-size: 16px');
};

window.downloadResults = function() {
    if (collectedUrls.size === 0) {
        console.log('%c⚠️ No URLs to download', 'color: orange');
        return;
    }
    
    let blob = new Blob([Array.from(collectedUrls).join('\n')], {type: 'text/plain'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    let date = new Date().toISOString().split('T')[0];
    a.download = `pinterest_export_${collectedUrls.size}_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`%c✅ Downloaded: ${collectedUrls.size} URLs`, 'color: lime; font-size: 16px; font-weight: bold');
};

window.setPreset = function(presetName) {
    if (!PRESETS[presetName]) {
        console.log('%c❌ Unknown preset!', 'color: red');
        return;
    }
    
    let preset = PRESETS[presetName];
    CONFIG.stepX = preset.stepX;
    CONFIG.stepY = preset.stepY;
    CONFIG.pauseX = preset.pauseX;
    CONFIG.pauseY = preset.pauseY;
    CONFIG.waveAmplitude = preset.waveAmplitude;
    CONFIG.waveFrequency = preset.waveFrequency;
    
    console.log(`%c✅ ${preset.name}`, 'color: lime; font-size: 16px; font-weight: bold');
};

window.setWave = function(type) {
    const validTypes = ['sine', 'triangle', 'random', 'double', 'none'];
    if (!validTypes.includes(type)) {
        console.log('%c❌ Invalid wave type!', 'color: red');
        return;
    }
    
    CONFIG.waveType = type;
    CONFIG.waveEnabled = (type !== 'none');
    
    console.log(`%c✅ Wave type: ${type}`, 'color: lime; font-size: 16px; font-weight: bold');
};

window.showUI = function() {
    if (!controlPanel) {
        createUI();
    } else {
        controlPanel.style.display = 'block';
    }
};

window.hideUI = function() {
    if (controlPanel) {
        controlPanel.style.display = 'none';
    }
};

// ==================== START ====================
console.clear();
console.log('%c╔═══════════════════════════════════════════════════════╗', 'color: cyan');
console.log('%c║   🚜 PINTEREST URL COLLECTOR v6.0 - FINAL? EDITION   ║', 'color: cyan; font-weight: bold; font-size: 16px');
console.log('%c╚═══════════════════════════════════════════════════════╝', 'color: cyan');
console.log('\n%c🎉 NEW Features:', 'color: lime; font-size: 18px; font-weight: bold');
console.log('  • Wave Amplitude & Frequency Sliders');
console.log('  • Progress Bar');
console.log('  • Last Found URL Preview');
console.log('  • Domain Filter (blocks Instagram by default)');
console.log('\n%c👉 Opening Control Panel...', 'color: yellow; font-size: 14px');

// Auto-show UI
setTimeout(() => {
    createUI();
    console.log('%c✅ Ready! Click START to begin collecting.', 'color: lime; font-weight: bold; font-size: 14px');
}, 500);
