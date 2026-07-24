/**
 * AuraPlayer - Premium Spotify-Inspired Music Player
 * Vanilla ES6+ JS Implementation
 */

// --- STATE MANAGEMENT ---
let state = {
    playlist: [], // Active playlist
    currentTrackIndex: 0,
    isPlaying: false,
    volume: 0.8, // 0.0 to 1.0
    isMuted: false,
    shuffleState: false, // false, true
    repeatState: 'off', // 'off', 'one', 'all'
    favorites: [], // Array of track IDs
    recentlyPlayed: [], // Array of track IDs (max 10)
    currentTab: 'all', // 'all', 'favorites', 'recent'
    currentGenre: 'All',
    searchQuery: '',
    onlineSearchResults: [], // Fetched tracks from APIs
    playbackSpeed: 1.0,
    theme: 'dark'
};

// Database of Default Tracks
const DEFAULT_TRACKS = [
    {
        id: "track-1",
        title: "Lost in the City Lights",
        artist: "Cosimo Fogg",
        album: "Ambient Sounds Vol. 1",
        genre: "Lo-Fi",
        year: "2019",
        duration: "04:30",
        src: "assets/songs/song1.mp3",
        fallbackSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "assets/covers/cover1.jpg",
        fallbackCover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&fit=crop"
    },
    {
        id: "track-2",
        title: "Cyberpunk Horizon",
        artist: "Neon Drive",
        album: "Grid Racer",
        genre: "EDM",
        year: "2021",
        duration: "07:05",
        src: "assets/songs/song2.mp3",
        fallbackSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "assets/covers/cover2.jpg",
        fallbackCover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=400&fit=crop"
    },
    {
        id: "track-3",
        title: "Acoustic Sunset",
        artist: "Maple Leaf",
        album: "Campfire Memories",
        genre: "Rock",
        year: "2020",
        duration: "05:44",
        src: "assets/songs/song3.mp3",
        fallbackSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "assets/covers/cover3.jpg",
        fallbackCover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&h=400&fit=crop"
    },
    {
        id: "track-4",
        title: "Jazz Cafe",
        artist: "Blue Notes Quartet",
        album: "Late Night Grooves",
        genre: "Jazz",
        year: "2018",
        duration: "05:02",
        src: "assets/songs/song4.mp3",
        fallbackSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "assets/covers/cover4.jpg",
        fallbackCover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&h=400&fit=crop"
    }
];

// --- AUDIO & WEB AUDIO API NODES ---
const audioEl = document.getElementById('audio-element');
let audioContext = null;
let audioSource = null;
let analyserNode = null;
let animationFrameId = null;
let isAudioContextInitialized = false;

// --- DOM ELEMENTS ---
const appContainer = document.getElementById('app-container');
const loadingScreen = document.getElementById('loading-screen');
const loadingStatus = document.getElementById('loading-status');
const loadingProgress = document.getElementById('loading-progress');

// Left Sidebar Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const searchSpinner = document.getElementById('search-spinner');
const navItems = document.querySelectorAll('.nav-menu .nav-item');
const genreTags = document.querySelectorAll('.genre-tag');
const keyboardHelpBtn = document.getElementById('keyboard-help-btn');
const shortcutsModal = document.getElementById('shortcuts-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// Mobile Controls
const mobileSearchToggle = document.getElementById('mobile-search-toggle');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebarPanel = document.querySelector('.sidebar-panel');
const mainContent = document.querySelector('.main-content');

// Main Player Panel Elements
const visualizerCanvas = document.getElementById('visualizer-canvas');
const artworkGlow = document.getElementById('artwork-glow-el');
const artworkCard = document.getElementById('artwork-card-el');
const heroCover = document.getElementById('hero-cover');
const heroTitle = document.getElementById('hero-title');
const heroArtist = document.getElementById('hero-artist');
const heroAlbum = document.getElementById('hero-album');
const heroGenre = document.getElementById('hero-genre');
const heroYear = document.getElementById('hero-year');
const heroDuration = document.getElementById('hero-duration');
const heroFavoriteBtn = document.getElementById('hero-favorite-btn');
const audioBarsAnim = document.getElementById('audio-bars-anim');

// Playlist Panel Elements
const playlistPanel = document.querySelector('.playlist-panel');
const playlistCount = document.getElementById('playlist-count');
const addSongBtn = document.getElementById('add-song-btn');
const songFileInput = document.getElementById('song-file-input');
const playlistUl = document.getElementById('playlist-ul');
const playlistEmptyState = document.getElementById('playlist-empty-state');
const resetPlaylistBtn = document.getElementById('reset-playlist-btn');

// Bottom Player Controls
const timeCurrent = document.getElementById('time-current');
const timeRemaining = document.getElementById('time-remaining');
const progressBarWrapper = document.getElementById('progress-bar-wrapper');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');

const controlPreviewCover = document.getElementById('control-preview-cover');
const controlPreviewTitle = document.getElementById('control-preview-title');
const controlPreviewArtist = document.getElementById('control-preview-artist');

const btnShuffle = document.getElementById('btn-shuffle');
const btnPrev = document.getElementById('btn-prev');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnStop = document.getElementById('btn-stop');
const btnRepeat = document.getElementById('btn-repeat');
const repeatBadge = document.getElementById('repeat-badge');

const speedBtn = document.getElementById('speed-btn');
const currentSpeedLabel = document.getElementById('current-speed-label');
const speedMenu = document.getElementById('speed-menu');
const speedOptions = document.querySelectorAll('.speed-option');

const btnMute = document.getElementById('btn-mute');
const volumeBarWrapper = document.getElementById('volume-bar-wrapper');
const volumeFill = document.getElementById('volume-fill');
const volumeThumb = document.getElementById('volume-thumb');

// Mini Player Elements
const miniPlayer = document.getElementById('mini-player');
const miniCover = document.getElementById('mini-cover');
const miniTitle = document.getElementById('mini-title');
const miniArtist = document.getElementById('mini-artist');
const miniPlayPauseBtn = document.getElementById('mini-play-pause');
const miniPrevBtn = document.getElementById('mini-prev');
const miniNextBtn = document.getElementById('mini-next');
const miniProgressFill = document.getElementById('mini-progress-fill');

// Toast Container
const toastContainer = document.getElementById('toast-container');

// --- INITIALIZE & THEME MANAGER ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    simulateLoadingScreen(() => {
        loadLocalStorage();
        setupTheme();
        initParticleBackground();
        setupAudioEventListeners();
        setupControlEventListeners();
        setupDragAndDrop();
        setupKeyboardShortcuts();
        setupMiniPlayerDragging();
        setupIntersectionObserver();
        
        renderPlaylist();
        loadTrack(state.currentTrackIndex, false);
        updateUI();
        
        // Unhide the app
        appContainer.classList.remove('hidden');
        loadingScreen.classList.add('fade-out');
        showToast("Welcome to AuraPlayer!", "success");
    });
}

// Simulated loading screen to mimic preparing resources
function simulateLoadingScreen(callback) {
    const statuses = [
        "Preparing Playlist...",
        "Loading audio engines...",
        "Building layout visualizers...",
        "Ready!"
    ];
    let step = 0;
    
    const interval = setInterval(() => {
        if (step < statuses.length) {
            loadingStatus.textContent = statuses[step];
            const progressPercent = ((step + 1) / statuses.length) * 100;
            loadingProgress.style.width = `${progressPercent}%`;
            step++;
        } else {
            clearInterval(interval);
            callback();
        }
    }, 450);
}

// Local Storage Handlers
function loadLocalStorage() {
    try {
        state.theme = localStorage.getItem('auraplayer-theme') || 'dark';
        state.volume = parseFloat(localStorage.getItem('auraplayer-volume')) || 0.8;
        state.isMuted = localStorage.getItem('auraplayer-muted') === 'true';
        state.shuffleState = localStorage.getItem('auraplayer-shuffle') === 'true';
        state.repeatState = localStorage.getItem('auraplayer-repeat') || 'off';
        
        // Load Playlist (or fall back to defaults)
        const storedPlaylist = localStorage.getItem('auraplayer-playlist');
        if (storedPlaylist) {
            state.playlist = JSON.parse(storedPlaylist);
        } else {
            state.playlist = [...DEFAULT_TRACKS];
        }
        
        // Load index
        const storedIndex = parseInt(localStorage.getItem('auraplayer-current-index'));
        if (!isNaN(storedIndex) && storedIndex >= 0 && storedIndex < state.playlist.length) {
            state.currentTrackIndex = storedIndex;
        } else {
            state.currentTrackIndex = 0;
        }
        
        // Load Favorites
        const storedFavorites = localStorage.getItem('auraplayer-favorites');
        state.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        
        // Load Recently Played
        const storedRecent = localStorage.getItem('auraplayer-recent');
        state.recentlyPlayed = storedRecent ? JSON.parse(storedRecent) : [];
        
    } catch (e) {
        console.error("Local storage read failed. Using defaults.", e);
        state.playlist = [...DEFAULT_TRACKS];
        state.favorites = [];
        state.recentlyPlayed = [];
    }
}

function savePlaylistState() {
    localStorage.setItem('auraplayer-playlist', JSON.stringify(state.playlist));
}

function saveState() {
    localStorage.setItem('auraplayer-current-index', state.currentTrackIndex);
    localStorage.setItem('auraplayer-volume', state.volume);
    localStorage.setItem('auraplayer-muted', state.isMuted);
    localStorage.setItem('auraplayer-shuffle', state.shuffleState);
    localStorage.setItem('auraplayer-repeat', state.repeatState);
    localStorage.setItem('auraplayer-favorites', JSON.stringify(state.favorites));
    localStorage.setItem('auraplayer-recent', JSON.stringify(state.recentlyPlayed));
}

// Theme Handlers
function setupTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeUI();
    
    themeToggleBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('auraplayer-theme', state.theme);
        updateThemeUI();
        showToast(`Switched to ${state.theme} mode`, "info");
    });
}

function updateThemeUI() {
    if (state.theme === 'dark') {
        themeToggleBtn.classList.remove('light-active');
    } else {
        themeToggleBtn.classList.add('light-active');
    }
}

// --- PARTICLE BACKGROUNDS ---
function initParticleBackground() {
    const container = document.getElementById('particle-canvas-container');
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * -0.3 - 0.05; // float upwards
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.x + this.speedX < 0 || this.x + this.speedX > canvas.width ? -this.speedX : this.speedX;
            this.y += this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = state.theme === 'dark' 
                ? `rgba(255, 255, 255, ${this.alpha})` 
                : `rgba(0, 0, 0, ${this.alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000); // density
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
}

// --- AUDIO ENGINE LOGIC ---
function initializeAudioContext() {
    if (isAudioContextInitialized) return;
    
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 128; // Radial ring fidelity
        
        audioSource = audioContext.createMediaElementSource(audioEl);
        audioSource.connect(analyserNode);
        analyserNode.connect(audioContext.destination);
        
        isAudioContextInitialized = true;
        setupVisualizer();
    } catch (e) {
        console.error("Web Audio API not supported or context blocked", e);
    }
}

function setupAudioEventListeners() {
    // Media Playback events
    audioEl.addEventListener('play', () => {
        state.isPlaying = true;
        updatePlayStateUI();
        startVisualizer();
        initializeAudioContext();
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });
    
    audioEl.addEventListener('pause', () => {
        state.isPlaying = false;
        updatePlayStateUI();
    });
    
    audioEl.addEventListener('ended', () => {
        handleTrackEnded();
    });
    
    audioEl.addEventListener('timeupdate', () => {
        updateProgress();
    });
    
    audioEl.addEventListener('durationchange', () => {
        updateDurationDisplay();
    });

    audioEl.addEventListener('error', (e) => {
        console.warn("Local track failed to load, trying online URL fallback...", e);
        const track = state.playlist[state.currentTrackIndex];
        
        if (track && track.fallbackSrc && audioEl.src !== track.fallbackSrc) {
            audioEl.src = track.fallbackSrc;
            if (state.isPlaying) {
                audioEl.play().catch(err => {
                    console.error("Fallback URL failed", err);
                    triggerFallbackSynthPlay();
                });
            }
        } else {
            triggerFallbackSynthPlay();
        }
    });
}

// Web Audio API Synthesizer Fallback (If assets fail entirely / offline)
let synthInterval = null;
let isSynthPlaying = false;
function triggerFallbackSynthPlay() {
    showToast("Media failed to load. Initiating synthetic Ambient Node arpeggiator fallback.", "warning");
    
    if (synthInterval) clearInterval(synthInterval);
    isSynthPlaying = true;
    
    // Animate visual bars based on random ticks for the visual effect
    let dummyFrequencies = new Uint8Array(64);
    
    synthInterval = setInterval(() => {
        if (!state.isPlaying) return;
        
        // Synthesize short note using AudioContext
        if (isAudioContextInitialized && audioContext) {
            const time = audioContext.currentTime;
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            // Connect to destination directly so it works offline
            gain.connect(audioContext.destination);
            
            // Generate a pentatonic lofi melody
            const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            
            osc.frequency.setValueAtTime(randomNote, time);
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0.04, time); // quiet
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);
            
            osc.start(time);
            osc.stop(time + 1.3);
        }
    }, 800);
}

function stopSynthFallback() {
    isSynthPlaying = false;
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

// Radial Frequency Visualizer Setup
function setupVisualizer() {
    const canvas = visualizerCanvas;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Scale canvas for High-DPI screens
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
        if (!state.isPlaying && !isSynthPlaying) {
            // Decaying visualizer towards zero when paused
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            animationFrameId = requestAnimationFrame(draw);
            return;
        }
        
        animationFrameId = requestAnimationFrame(draw);
        analyserNode.getByteFrequencyData(dataArray);
        
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        
        const centerX = canvas.clientWidth / 2;
        const centerY = canvas.clientHeight / 2;
        const baseRadius = 145; // Surrounds artwork card (280px / 2 = 140px + padding)
        
        // Change colors dynamically based on active playing colors
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-accent').trim();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = accentColor;
        
        const points = bufferLength - 20; // Truncate extreme frequencies
        
        ctx.beginPath();
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const value = dataArray[i];
            const scale = (value / 255) * 45; // Max displacement length
            
            const r = baseRadius + scale;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(centerX, centerY, baseRadius, centerX, centerY, baseRadius + 40);
        gradient.addColorStop(0, accentColor);
        gradient.addColorStop(1, secondaryColor);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3.5;
        ctx.stroke();
    }
    
    draw();
}

function startVisualizer() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (analyserNode) {
        setupVisualizer();
    }
}

// --- TRACK CONTROLLER & NAVIGATION ---
function loadTrack(index, shouldPlay = true) {
    if (state.playlist.length === 0) {
        loadEmptyState();
        return;
    }
    
    stopSynthFallback();
    
    state.currentTrackIndex = index;
    const track = state.playlist[index];
    
    // Audio source loader
    audioEl.src = track.src;
    audioEl.playbackRate = state.playbackSpeed;
    
    // Set text elements
    heroTitle.textContent = track.title;
    heroArtist.textContent = track.artist;
    heroAlbum.textContent = track.album || '-';
    heroGenre.textContent = track.genre || '-';
    heroYear.textContent = track.year || '-';
    heroDuration.textContent = track.duration;
    
    // Update Album covers (with URL fallbacks)
    heroCover.src = track.cover;
    heroCover.onerror = () => {
        heroCover.src = track.fallbackCover || '';
    };
    artworkGlow.style.backgroundImage = `url(${track.cover})`;
    
    // Update preview bottom bar
    controlPreviewCover.src = track.cover;
    controlPreviewCover.onerror = () => {
        controlPreviewCover.src = track.fallbackCover || '';
    };
    controlPreviewCover.classList.remove('hidden');
    controlPreviewTitle.textContent = track.title;
    controlPreviewArtist.textContent = track.artist;
    
    // Update mini-player
    miniCover.src = track.cover;
    miniCover.onerror = () => {
        miniCover.src = track.fallbackCover || '';
    };
    miniTitle.textContent = track.title;
    miniArtist.textContent = track.artist;
    
    // Save last index to storage
    saveState();
    
    // Render selected item in playlist list
    updatePlaylistActiveItem();
    
    // Trigger play or initial state
    if (shouldPlay) {
        playTrack();
    } else {
        pauseTrack();
        // Load initial progress bar position if stored position exists
        const savedProgress = parseFloat(localStorage.getItem('auraplayer-playback-position')) || 0;
        if (savedProgress > 0) {
            audioEl.currentTime = savedProgress;
        }
    }
    
    // Check favorite status
    updateFavoriteButtonUI();
}

function playTrack() {
    audioEl.play()
        .then(() => {
            state.isPlaying = true;
            updatePlayStateUI();
            addRecentlyPlayed(state.playlist[state.currentTrackIndex].id);
        })
        .catch(err => {
            console.warn("Direct play failed, waiting for user interactions...", err);
            // Usually happens because browser blocks auto-play before interaction
            state.isPlaying = false;
            updatePlayStateUI();
        });
}

function pauseTrack() {
    audioEl.pause();
    state.isPlaying = false;
    updatePlayStateUI();
}

function togglePlay() {
    if (state.playlist.length === 0) return;
    
    initializeAudioContext();
    if (state.isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function stopTrack() {
    audioEl.pause();
    audioEl.currentTime = 0;
    state.isPlaying = false;
    updatePlayStateUI();
    stopSynthFallback();
}

function prevTrack() {
    if (state.playlist.length === 0) return;
    
    let targetIndex = state.currentTrackIndex - 1;
    if (targetIndex < 0) {
        targetIndex = state.playlist.length - 1; // loop
    }
    loadTrack(targetIndex, true);
    showToast("Skipped to Previous", "info");
}

function nextTrack() {
    if (state.playlist.length === 0) return;
    
    let targetIndex = state.currentTrackIndex;
    
    if (state.shuffleState) {
        targetIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
        targetIndex = state.currentTrackIndex + 1;
        if (targetIndex >= state.playlist.length) {
            targetIndex = 0; // loop back
        }
    }
    
    loadTrack(targetIndex, true);
    showToast("Skipped to Next", "info");
}

function handleTrackEnded() {
    if (state.repeatState === 'one') {
        audioEl.currentTime = 0;
        playTrack();
    } else if (state.repeatState === 'all') {
        nextTrack();
    } else {
        // Stop playing if it's the last song, otherwise next
        if (state.currentTrackIndex === state.playlist.length - 1 && !state.shuffleState) {
            stopTrack();
        } else {
            nextTrack();
        }
    }
}

// Add track ID to Recently Played (Max 10 records)
function addRecentlyPlayed(id) {
    if (!id) return;
    
    // Filter duplicates
    state.recentlyPlayed = state.recentlyPlayed.filter(itemId => itemId !== id);
    // Push to front
    state.recentlyPlayed.unshift(id);
    // Slice to max 10
    if (state.recentlyPlayed.length > 10) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 10);
    }
    
    saveState();
    if (state.currentTab === 'recent') {
        renderPlaylist();
    }
}

// Toggle Favorite State
function toggleFavorite(id) {
    if (!id) return;
    
    const index = state.favorites.indexOf(id);
    if (index === -1) {
        state.favorites.push(id);
        showToast("Added to Favorites", "success");
    } else {
        state.favorites.splice(index, 1);
        showToast("Removed from Favorites", "info");
    }
    
    saveState();
    updateFavoriteButtonUI();
    
    // Re-render playlist if we are looking at the favorites tab
    if (state.currentTab === 'favorites') {
        renderPlaylist();
    } else {
        // Toggle the row heart icons
        const rowHeart = document.querySelector(`.playlist-item[data-id="${id}"] .favorite-song-btn`);
        if (rowHeart) {
            rowHeart.classList.toggle('active', index === -1);
        }
    }
}

function updateFavoriteButtonUI() {
    const track = state.playlist[state.currentTrackIndex];
    if (track) {
        const isFav = state.favorites.includes(track.id);
        heroFavoriteBtn.classList.toggle('active', isFav);
        heroFavoriteBtn.setAttribute('aria-label', isFav ? "Remove from Favorites" : "Add to Favorites");
    }
}

// --- SETUP DOM EVENT HANDLERS ---
function setupControlEventListeners() {
    // Play / Pause toggles
    btnPlayPause.addEventListener('click', togglePlay);
    miniPlayPauseBtn.addEventListener('click', togglePlay);
    
    // Navigation
    btnNext.addEventListener('click', nextTrack);
    miniNextBtn.addEventListener('click', nextTrack);
    btnPrev.addEventListener('click', prevTrack);
    miniPrevBtn.addEventListener('click', prevTrack);
    
    // Stop
    btnStop.addEventListener('click', stopTrack);
    
    // Shuffle
    btnShuffle.addEventListener('click', () => {
        state.shuffleState = !state.shuffleState;
        btnShuffle.classList.toggle('active', state.shuffleState);
        saveState();
        showToast(`Shuffle ${state.shuffleState ? 'Enabled' : 'Disabled'}`, "info");
    });
    
    // Repeat mode loop: off -> all -> one -> off
    btnRepeat.addEventListener('click', () => {
        if (state.repeatState === 'off') {
            state.repeatState = 'all';
            btnRepeat.classList.add('active');
            repeatBadge.classList.add('hidden');
            showToast("Repeat All Tracks", "info");
        } else if (state.repeatState === 'all') {
            state.repeatState = 'one';
            btnRepeat.classList.add('active');
            repeatBadge.classList.remove('hidden');
            showToast("Repeat Current Track", "info");
        } else {
            state.repeatState = 'off';
            btnRepeat.classList.remove('active');
            repeatBadge.classList.add('hidden');
            showToast("Repeat Disabled", "info");
        }
        saveState();
    });
    
    // Playback Speed Button toggle dropdown
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle('hidden');
    });
    
    document.addEventListener('click', () => {
        speedMenu.classList.add('hidden');
    });
    
    speedOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            speedOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            const speed = parseFloat(opt.getAttribute('data-speed'));
            state.playbackSpeed = speed;
            audioEl.playbackRate = speed;
            currentSpeedLabel.textContent = `${speed.toFixed(1)}x`;
            showToast(`Speed set to ${speed}x`, "info");
        });
    });
    
    // Volume Control Row
    btnMute.addEventListener('click', toggleMute);
    volumeBarWrapper.addEventListener('mousedown', startVolumeDrag);
    volumeBarWrapper.addEventListener('click', seekVolumeDirectly);
    
    // Progress Timeline Seek Row
    progressBarWrapper.addEventListener('mousedown', startProgressDrag);
    progressBarWrapper.addEventListener('click', seekProgressDirectly);
    
    // Left Navigation Tabs
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            state.currentTab = item.getAttribute('data-tab');
            renderPlaylist();
            
            // Close mobile menu if active
            sidebarPanel.classList.remove('active-mobile-panel');
        });
    });
    
    // Genre Categorization filters
    genreTags.forEach(tag => {
        tag.addEventListener('click', () => {
            genreTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            state.currentGenre = tag.getAttribute('data-genre');
            renderPlaylist();
        });
    });
    
    // Live Search Filter input (Debounced API + Local Search)
    let debounceTimer = null;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        state.searchQuery = query;
        clearSearchBtn.classList.toggle('hidden', query === '');
        
        // Instant filter locally
        renderPlaylist();
        
        // Debounce online search
        clearTimeout(debounceTimer);
        if (query.length > 2) {
            debounceTimer = setTimeout(() => {
                fetchOnlineSongs(query);
            }, 600);
        } else {
            state.onlineSearchResults = [];
            renderPlaylist();
            if (searchSpinner) searchSpinner.classList.add('hidden');
        }
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        state.onlineSearchResults = [];
        clearSearchBtn.classList.add('hidden');
        if (searchSpinner) searchSpinner.classList.add('hidden');
        renderPlaylist();
    });
    
    // Keyboard Help Overlay
    keyboardHelpBtn.addEventListener('click', () => {
        shortcutsModal.classList.remove('hidden');
    });
    
    closeModalBtn.addEventListener('click', () => {
        shortcutsModal.classList.add('hidden');
    });
    
    shortcutsModal.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
            shortcutsModal.classList.add('hidden');
        }
    });
    
    // Add custom audio track file button loader
    addSongBtn.addEventListener('click', () => {
        songFileInput.click();
    });
    
    songFileInput.addEventListener('change', handleCustomSongImport);
    
    resetPlaylistBtn.addEventListener('click', () => {
        state.playlist = [...DEFAULT_TRACKS];
        savePlaylistState();
        renderPlaylist();
        loadTrack(0, false);
        showToast("Restored playlist to default tracks", "success");
    });
    
    heroFavoriteBtn.addEventListener('click', () => {
        if (state.playlist.length > 0) {
            toggleFavorite(state.playlist[state.currentTrackIndex].id);
        }
    });

    // Mobile Panel triggers
    mobileSearchToggle.addEventListener('click', () => {
        searchInput.focus();
    });

    mobileMenuToggle.addEventListener('click', () => {
        sidebarPanel.classList.toggle('active-mobile-panel');
    });
}

// Custom Song Importer
function handleCustomSongImport(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    let importedCount = 0;
    
    files.forEach(file => {
        // Verify audio mime type
        if (!file.type.startsWith('audio/')) {
            showToast(`Unsupported format: ${file.name}`, "error");
            return;
        }
        
        const fileUrl = URL.createObjectURL(file);
        
        // Clean up file name to use as title
        let title = file.name.replace(/\.[^/.]+$/, ""); // Strip file extension
        title = title.replace(/[_-]/g, " "); // Replace dashes
        
        const trackId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        
        const newTrack = {
            id: trackId,
            title: title,
            artist: "Local File",
            album: file.type.split('/')[1].toUpperCase() + " Audio",
            genre: "Uploaded",
            year: new Date().getFullYear().toString(),
            duration: "Calculating...",
            src: fileUrl,
            fallbackSrc: fileUrl,
            // Random default premium background pattern cover
            cover: `https://images.unsplash.com/photo-${['1508700115892-45ecd05ae2ad', '1511192336575-5a79af67a629', '1514525253161-7a46d19cd819', '1614613535308-eb5fbd3d2c17'][Math.floor(Math.random() * 4)]}?q=80&w=400&h=400&fit=crop`
        };
        
        // Temporarily load in dummy element to extract duration details
        const tempAudio = new Audio(fileUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
            const mins = Math.floor(tempAudio.duration / 60);
            const secs = Math.floor(tempAudio.duration % 60);
            newTrack.duration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            renderPlaylist();
        });
        
        state.playlist.push(newTrack);
        importedCount++;
    });
    
    if (importedCount > 0) {
        savePlaylistState();
        renderPlaylist();
        showToast(`Imported ${importedCount} local files`, "success");
        // Play the last added track immediately
        loadTrack(state.playlist.length - 1, true);
    }
    
    // Clear input
    songFileInput.value = '';
}

// --- DRAG & DROP PLAYLIST LIST ---
function setupDragAndDrop() {
    let dragSrcEl = null;
    
    playlistUl.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.playlist-item');
        if (!item) return;
        
        dragSrcEl = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.getAttribute('data-id'));
    });
    
    playlistUl.addEventListener('dragover', (e) => {
        e.preventDefault();
        const overEl = e.target.closest('.playlist-item');
        if (!overEl || overEl === dragSrcEl) return;
        
        overEl.classList.add('drag-over');
    });
    
    playlistUl.addEventListener('dragleave', (e) => {
        const leaveEl = e.target.closest('.playlist-item');
        if (leaveEl) leaveEl.classList.remove('drag-over');
    });
    
    playlistUl.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropEl = e.target.closest('.playlist-item');
        if (!dropEl || dropEl === dragSrcEl) return;
        
        dropEl.classList.remove('drag-over');
        
        const srcId = e.dataTransfer.getData('text/plain');
        const targetId = dropEl.getAttribute('data-id');
        
        reorderPlaylistArray(srcId, targetId);
    });
    
    playlistUl.addEventListener('dragend', () => {
        const items = playlistUl.querySelectorAll('.playlist-item');
        items.forEach(i => {
            i.classList.remove('dragging');
            i.classList.remove('drag-over');
        });
    });
}

function reorderPlaylistArray(srcId, targetId) {
    const srcIndex = state.playlist.findIndex(t => t.id === srcId);
    const targetIndex = state.playlist.findIndex(t => t.id === targetId);
    
    if (srcIndex === -1 || targetIndex === -1) return;
    
    // Track currently playing metadata
    const activeTrackId = state.playlist[state.currentTrackIndex].id;
    
    // Move element in array
    const [movedItem] = state.playlist.splice(srcIndex, 1);
    state.playlist.splice(targetIndex, 0, movedItem);
    
    // Recompute current active index mapping
    state.currentTrackIndex = state.playlist.findIndex(t => t.id === activeTrackId);
    
    savePlaylistState();
    saveState();
    renderPlaylist();
    updatePlaylistActiveItem();
    showToast("Queue reordered", "info");
}

// --- RENDER PLAYLIST PANEL ---
function renderPlaylist() {
    // Filter matching local songs
    let filteredList = state.playlist.filter(song => {
        // Tab check
        if (state.currentTab === 'favorites') {
            if (!state.favorites.includes(song.id)) return false;
        } else if (state.currentTab === 'recent') {
            if (!state.recentlyPlayed.includes(song.id)) return false;
        }
        
        // Genre check
        if (state.currentGenre !== 'All' && song.genre !== state.currentGenre) {
            return false;
        }
        
        // Search text check
        if (state.searchQuery !== '') {
            const matchTitle = song.title.toLowerCase().includes(state.searchQuery);
            const matchArtist = song.artist.toLowerCase().includes(state.searchQuery);
            const matchAlbum = song.album.toLowerCase().includes(state.searchQuery);
            const matchGenre = song.genre.toLowerCase().includes(state.searchQuery);
            
            return matchTitle || matchArtist || matchAlbum || matchGenre;
        }
        
        return true;
    });

    // Special sorting for recently played (sort by last played order)
    if (state.currentTab === 'recent') {
        filteredList.sort((a, b) => {
            const indexA = state.recentlyPlayed.indexOf(a.id);
            const indexB = state.recentlyPlayed.indexOf(b.id);
            return indexA - indexB;
        });
    }
    
    playlistUl.innerHTML = '';
    
    const hasSearch = state.searchQuery.length > 2;
    const onlineList = hasSearch ? state.onlineSearchResults : [];
    const totalCount = filteredList.length + onlineList.length;
    
    playlistCount.textContent = `${totalCount} song${totalCount !== 1 ? 's' : ''}`;
    
    if (totalCount === 0) {
        playlistEmptyState.classList.remove('hidden');
        playlistUl.classList.add('hidden');
        return;
    } else {
        playlistEmptyState.classList.add('hidden');
        playlistUl.classList.remove('hidden');
    }
    
    // Helper to append a header item
    function appendSectionHeader(text) {
        const header = document.createElement('li');
        header.className = 'playlist-section-header';
        header.textContent = text;
        playlistUl.appendChild(header);
    }
    
    // Append Local Matches Section
    if (hasSearch && filteredList.length > 0) {
        appendSectionHeader("Library Queue Matches");
    }
    
    filteredList.forEach((song) => {
        const li = createPlaylistRow(song, false);
        playlistUl.appendChild(li);
    });
    
    // Append Online Matches Section
    if (hasSearch && onlineList.length > 0) {
        appendSectionHeader("Global Music Results");
        onlineList.forEach((song) => {
            const li = createPlaylistRow(song, true);
            playlistUl.appendChild(li);
        });
    }
}

// Helper to create a single row item (Local or Online)
function createPlaylistRow(song, isOnline = false) {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    if (isOnline) {
        li.classList.add('global-item');
        li.setAttribute('draggable', 'false');
    } else {
        li.setAttribute('draggable', 'true');
    }
    li.setAttribute('data-id', song.id);
    
    const isActive = state.playlist[state.currentTrackIndex] && state.playlist[state.currentTrackIndex].id === song.id;
    if (isActive) {
        li.classList.add('active');
    }
    
    const isFav = state.favorites.includes(song.id);
    
    li.innerHTML = `
        <div class="drag-handle" title="Drag to reorder" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="5" r="1"></circle> <circle cx="9" cy="12" r="1"></circle> <circle cx="9" cy="19" r="1"></circle>
                <circle cx="15" cy="5" r="1"></circle> <circle cx="15" cy="12" r="1"></circle> <circle cx="15" cy="19" r="1"></circle>
            </svg>
        </div>
        <img class="playlist-item-cover" src="${song.cover}" alt="" onerror="this.src='${song.fallbackCover}'">
        <div class="playlist-item-meta">
            <div class="playlist-item-title">${song.title}</div>
            <div class="playlist-item-artist">${song.artist}</div>
        </div>
        <div class="playlist-item-right">
            ${isActive && state.isPlaying ? `
                <div class="indicator-playing" title="Playing">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="2" width="4" height="20" rx="1"></rect>
                        <rect x="10" y="2" width="4" height="20" rx="1"></rect>
                        <rect x="18" y="2" width="4" height="20" rx="1"></rect>
                    </svg>
                </div>
            ` : ''}
            <span class="playlist-item-duration">${song.duration}</span>
            <button class="row-action-btn favorite-song-btn ${isFav ? 'active' : ''}" title="Favorite/Unfavorite">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
            ${isOnline ? `
                <button class="row-action-btn add-to-queue-btn" title="Add to active playlist queue">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            ` : `
                <button class="row-action-btn delete-song-btn" title="Delete song from queue">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `}
        </div>
    `;
    
    // Row Click Listener
    li.addEventListener('click', (e) => {
        if (e.target.closest('.row-action-btn') || e.target.closest('.drag-handle')) {
            return;
        }
        
        if (isOnline) {
            // Click to Play online track: Add to active queue and play immediately!
            const addedTrack = addOnlineTrackToQueue(song);
            const actualIndex = state.playlist.findIndex(t => t.id === addedTrack.id);
            if (actualIndex !== -1) {
                loadTrack(actualIndex, true);
                showToast(`Playing ${song.title}`, "success");
            }
        } else {
            const actualPlaylistIndex = state.playlist.findIndex(t => t.id === song.id);
            if (actualPlaylistIndex !== -1) {
                loadTrack(actualPlaylistIndex, true);
            }
        }
    });
    
    // Favorite Button Click
    const favRowBtn = li.querySelector('.favorite-song-btn');
    favRowBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (isOnline) {
            const addedTrack = addOnlineTrackToQueue(song);
            toggleFavorite(addedTrack.id);
        } else {
            toggleFavorite(song.id);
        }
    });
    
    // Action trigger button (Add to queue / delete)
    if (isOnline) {
        const addQueueBtn = li.querySelector('.add-to-queue-btn');
        addQueueBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addOnlineTrackToQueue(song);
            showToast(`Added ${song.title} to Queue`, "success");
        });
    } else {
        const delRowBtn = li.querySelector('.delete-song-btn');
        delRowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTrackFromPlaylist(song.id);
        });
    }
    
    return li;
}

// Add an online track metadata record to local state.playlist
function addOnlineTrackToQueue(onlineTrack) {
    const existing = state.playlist.find(t => t.id === onlineTrack.id);
    if (existing) return existing;
    
    const clonedTrack = { ...onlineTrack };
    delete clonedTrack.isOnline; // Clean up online helper tags
    
    state.playlist.push(clonedTrack);
    savePlaylistState();
    
    renderPlaylist();
    return clonedTrack;
}

// Live Online Search fetch handler (Deezer with iTunes fallback)
function fetchOnlineSongs(query) {
    if (!query) {
        state.onlineSearchResults = [];
        renderPlaylist();
        return;
    }
    
    if (searchSpinner) searchSpinner.classList.remove('hidden');
    
    // Setup callback name for Deezer JSONP
    const callbackName = 'deezerCallback_' + Math.floor(Math.random() * 1000000);
    
    // Timeout in case Deezer JSONP fails or hangs
    const timeoutId = setTimeout(() => {
        cleanUpJSONP();
        fetchiTunes(query);
    }, 2000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        cleanUpJSONP();
        
        const tracks = data.data || [];
        if (tracks.length > 0) {
            state.onlineSearchResults = tracks.map(track => ({
                id: 'deezer-' + track.id,
                title: track.title,
                artist: track.artist.name,
                album: track.album.title,
                genre: 'Online',
                year: new Date().getFullYear().toString(),
                duration: formatTime(track.duration),
                src: track.preview,
                cover: track.album.cover_medium,
                fallbackCover: track.album.cover_small,
                isOnline: true
            }));
            if (searchSpinner) searchSpinner.classList.add('hidden');
            renderPlaylist();
        } else {
            // Deezer API returned empty tracks due to geoblock, fallback to iTunes Search API
            fetchiTunes(query);
        }
    };
    
    const scriptEl = document.createElement('script');
    scriptEl.id = 'deezer-jsonp-script';
    scriptEl.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp&callback=${callbackName}`;
    
    function cleanUpJSONP() {
        const existing = document.getElementById('deezer-jsonp-script');
        if (existing) existing.remove();
        delete window[callbackName];
    }
    
    document.body.appendChild(scriptEl);
}

// iTunes Search API Fallback Fetcher
function fetchiTunes(query) {
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=15`)
        .then(res => res.json())
        .then(data => {
            const results = data.results || [];
            state.onlineSearchResults = results.map(track => {
                let coverUrl = track.artworkUrl100 || '';
                if (coverUrl) {
                    coverUrl = coverUrl.replace('100x100bb.jpg', '400x400bb.jpg');
                }
                
                const durationSecs = Math.floor(track.trackTimeMillis / 1000);
                const mins = Math.floor(durationSecs / 60);
                const secs = durationSecs % 60;
                const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                
                const year = track.releaseDate ? track.releaseDate.substring(0, 4) : 'N/A';
                
                return {
                    id: 'itunes-' + track.trackId,
                    title: track.trackName,
                    artist: track.artistName,
                    album: track.collectionName || 'Single',
                    genre: track.primaryGenreName || 'Pop',
                    year: year,
                    duration: formattedDuration,
                    src: track.previewUrl,
                    cover: coverUrl,
                    fallbackCover: track.artworkUrl100,
                    isOnline: true
                };
            });
            if (searchSpinner) searchSpinner.classList.add('hidden');
            renderPlaylist();
        })
        .catch(err => {
            console.error("iTunes search fallback failed", err);
            if (searchSpinner) searchSpinner.classList.add('hidden');
            showToast("Search query failed", "error");
        });
}

function updatePlaylistActiveItem() {
    const items = playlistUl.querySelectorAll('.playlist-item');
    const currentTrack = state.playlist[state.currentTrackIndex];
    
    items.forEach(item => {
        const id = item.getAttribute('data-id');
        if (currentTrack && id === currentTrack.id) {
            item.classList.add('active');
            
            // Inject animated playing indicator
            let indicator = item.querySelector('.indicator-playing');
            if (state.isPlaying && !indicator) {
                const rightGroup = item.querySelector('.playlist-item-right');
                const durSpan = item.querySelector('.playlist-item-duration');
                
                const indEl = document.createElement('div');
                indEl.className = 'indicator-playing';
                indEl.innerHTML = `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="2" width="4" height="20" rx="1"></rect>
                        <rect x="10" y="2" width="4" height="20" rx="1"></rect>
                        <rect x="18" y="2" width="4" height="20" rx="1"></rect>
                    </svg>
                `;
                rightGroup.insertBefore(indEl, durSpan);
            } else if (!state.isPlaying && indicator) {
                indicator.remove();
            }
        } else {
            item.classList.remove('active');
            const indicator = item.querySelector('.indicator-playing');
            if (indicator) indicator.remove();
        }
    });
}

function deleteTrackFromPlaylist(id) {
    if (state.playlist.length === 0) return;
    
    const targetIdx = state.playlist.findIndex(t => t.id === id);
    if (targetIdx === -1) return;
    
    const wasPlayingDeleted = (state.currentTrackIndex === targetIdx);
    
    state.playlist.splice(targetIdx, 1);
    state.favorites = state.favorites.filter(fid => fid !== id);
    state.recentlyPlayed = state.recentlyPlayed.filter(fid => fid !== id);
    
    savePlaylistState();
    saveState();
    
    showToast("Song deleted", "info");
    
    if (state.playlist.length === 0) {
        loadEmptyState();
    } else {
        if (wasPlayingDeleted) {
            // Load closest next song index
            const nextIdx = targetIdx >= state.playlist.length ? 0 : targetIdx;
            loadTrack(nextIdx, state.isPlaying);
        } else {
            // Adjust indexing mapping
            if (targetIdx < state.currentTrackIndex) {
                state.currentTrackIndex--;
            }
            saveState();
        }
        renderPlaylist();
        updatePlaylistActiveItem();
    }
}

function loadEmptyState() {
    stopTrack();
    heroTitle.textContent = "No Song Available";
    heroArtist.textContent = "Add songs or reset list";
    heroAlbum.textContent = "-";
    heroGenre.textContent = "-";
    heroYear.textContent = "-";
    heroDuration.textContent = "00:00";
    heroCover.src = "";
    artworkGlow.style.backgroundImage = "none";
    
    controlPreviewCover.classList.add('hidden');
    controlPreviewTitle.textContent = "Playlist Empty";
    controlPreviewArtist.textContent = "Add tracks";
    
    miniCover.src = "";
    miniTitle.textContent = "Playlist Empty";
    miniArtist.textContent = "Add tracks";
    
    renderPlaylist();
    showToast("No songs available in queue", "error");
}

// --- TIMELINE SEEK CONTROLS ---
function updateProgress() {
    if (isNaN(audioEl.duration)) return;
    
    const percent = (audioEl.currentTime / audioEl.duration) * 100;
    progressFill.style.width = `${percent}%`;
    progressThumb.style.left = `${percent}%`;
    miniProgressFill.style.width = `${percent}%`;
    
    // Elapsed and remaining text calculations
    timeCurrent.textContent = formatTime(audioEl.currentTime);
    const remaining = audioEl.duration - audioEl.currentTime;
    timeRemaining.textContent = `-${formatTime(remaining)}`;
    
    // Save current play position to resume later
    localStorage.setItem('auraplayer-playback-position', audioEl.currentTime);
}

function updateDurationDisplay() {
    if (isNaN(audioEl.duration)) return;
    heroDuration.textContent = formatTime(audioEl.duration);
    updateProgress();
}

function formatTime(secs) {
    if (isNaN(secs) || secs < 0) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Seek Progress Click & Drag Event Listeners
function seekProgressDirectly(e) {
    if (state.playlist.length === 0 || isNaN(audioEl.duration)) return;
    
    const rect = progressBarWrapper.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const boundedPos = Math.max(0, Math.min(1, pos));
    
    audioEl.currentTime = boundedPos * audioEl.duration;
    updateProgress();
}

function startProgressDrag(e) {
    if (state.playlist.length === 0 || isNaN(audioEl.duration)) return;
    
    e.preventDefault();
    
    function moveHandler(moveEvent) {
        const rect = progressBarWrapper.getBoundingClientRect();
        const pos = (moveEvent.clientX - rect.left) / rect.width;
        const boundedPos = Math.max(0, Math.min(1, pos));
        
        progressFill.style.width = `${boundedPos * 100}%`;
        progressThumb.style.left = `${boundedPos * 100}%`;
        audioEl.currentTime = boundedPos * audioEl.duration;
    }
    
    function upHandler() {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
    }
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
}

// --- VOLUME CONTROLS ---
function toggleMute() {
    state.isMuted = !state.isMuted;
    audioEl.muted = state.isMuted;
    
    saveState();
    updateVolumeUI();
    showToast(state.isMuted ? "Audio Muted" : "Audio Unmuted", "info");
}

function seekVolumeDirectly(e) {
    const rect = volumeBarWrapper.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const boundedVolume = Math.max(0, Math.min(1, pos));
    
    state.volume = boundedVolume;
    state.isMuted = false;
    audioEl.volume = boundedVolume;
    audioEl.muted = false;
    
    saveState();
    updateVolumeUI();
}

function startVolumeDrag(e) {
    e.preventDefault();
    
    function moveHandler(moveEvent) {
        const rect = volumeBarWrapper.getBoundingClientRect();
        const pos = (moveEvent.clientX - rect.left) / rect.width;
        const boundedVolume = Math.max(0, Math.min(1, pos));
        
        state.volume = boundedVolume;
        state.isMuted = false;
        audioEl.volume = boundedVolume;
        audioEl.muted = false;
        
        updateVolumeUI();
    }
    
    function upHandler() {
        saveState();
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
    }
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
}

function updateVolumeUI() {
    const percent = state.isMuted ? 0 : state.volume * 100;
    volumeFill.style.width = `${percent}%`;
    volumeThumb.style.left = `${percent}%`;
    
    // Update mute speaker icon state SVGs
    const muteSvg = btnMute.querySelector('.vol-mute-svg');
    const highSvg = btnMute.querySelector('.vol-high-svg');
    
    if (state.isMuted || state.volume === 0) {
        muteSvg.classList.remove('hidden');
        highSvg.classList.add('hidden');
    } else {
        muteSvg.classList.add('hidden');
        highSvg.classList.remove('hidden');
    }
}

// --- GLOBAL KEYBOARD SHORTCUTS ---
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Prevent hotkeys running while user is typing in search
        if (document.activeElement.tagName === 'INPUT') {
            if (e.key === 'Escape') {
                document.activeElement.blur();
            }
            return;
        }
        
        const key = e.key.toLowerCase();
        
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevTrack();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextTrack();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            adjustVolume(0.05); // volume up 5%
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            adjustVolume(-0.05); // volume down 5%
        } else if (key === 's') {
            btnShuffle.click();
        } else if (key === 'r') {
            btnRepeat.click();
        } else if (key === 'm') {
            toggleMute();
        } else if (key === 'f') {
            if (state.playlist.length > 0) {
                toggleFavorite(state.playlist[state.currentTrackIndex].id);
            }
        } else if (e.key === '?') {
            keyboardHelpBtn.click();
        }
    });
}

function adjustVolume(delta) {
    let newVol = state.volume + delta;
    newVol = Math.max(0, Math.min(1, newVol));
    
    state.volume = newVol;
    state.isMuted = false;
    audioEl.volume = newVol;
    audioEl.muted = false;
    
    saveState();
    updateVolumeUI();
    showToast(`Volume: ${Math.round(newVol * 100)}%`, "info");
}

// --- UI UPDATE & PLAY STATE MUTATORS ---
function updateUI() {
    btnShuffle.classList.toggle('active', state.shuffleState);
    
    if (state.repeatState === 'all') {
        btnRepeat.classList.add('active');
        repeatBadge.classList.add('hidden');
    } else if (state.repeatState === 'one') {
        btnRepeat.classList.add('active');
        repeatBadge.classList.remove('hidden');
    } else {
        btnRepeat.classList.remove('active');
        repeatBadge.classList.add('hidden');
    }
    
    updateVolumeUI();
    updateFavoriteButtonUI();
    
    audioEl.volume = state.isMuted ? 0 : state.volume;
    audioEl.muted = state.isMuted;
}

function updatePlayStateUI() {
    const playSvgs = document.querySelectorAll('.play-svg, .mini-play-svg');
    const pauseSvgs = document.querySelectorAll('.pause-svg, .mini-pause-svg');
    
    if (state.isPlaying) {
        playSvgs.forEach(s => s.classList.add('hidden'));
        pauseSvgs.forEach(s => s.classList.remove('hidden'));
        
        // Artwork Rotation spin start
        artworkCard.classList.add('playing-spin');
        artworkCard.classList.remove('paused-spin');
        artworkGlow.style.opacity = '0.45';
        
        // Fallback visualizer bar pulses
        audioBarsAnim.classList.add('active');
        audioBarsAnim.classList.remove('paused');
    } else {
        playSvgs.forEach(s => s.classList.remove('hidden'));
        pauseSvgs.forEach(s => s.classList.add('hidden'));
        
        // Artwork Rotation spin pause
        artworkCard.classList.add('paused-spin');
        artworkGlow.style.opacity = '0';
        
        // Fallback visualizer bar pause
        audioBarsAnim.classList.add('paused');
    }
    
    updatePlaylistActiveItem();
}

// --- FLOATING MINI PLAYER INTERSECTION OBSERVER ---
function setupIntersectionObserver() {
    // When the large hero player card goes off screen on scroll, we pop open the mini player
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                miniPlayer.classList.add('hidden');
            } else {
                if (state.playlist.length > 0) {
                    miniPlayer.classList.remove('hidden');
                }
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1 // 10% visible
    });
    
    // Observe Hero section
    const target = document.querySelector('.hero-player');
    if (target) {
        observer.observe(target);
    }
}

// Draggable Mini-Player Widget
function setupMiniPlayerDragging() {
    let activeDrag = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragHandle = miniPlayer.querySelector('.mini-player-drag-handle');
    
    dragHandle.addEventListener('pointerdown', dragStart, false);
    document.addEventListener('pointerup', dragEnd, false);
    document.addEventListener('pointermove', dragMove, false);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === dragHandle || dragHandle.contains(e.target)) {
            activeDrag = true;
            miniPlayer.style.transition = 'none'; // Prevent lag
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        activeDrag = false;
        miniPlayer.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
    }

    function dragMove(e) {
        if (activeDrag) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            // Restrict bounds within window margins
            const playerRect = miniPlayer.getBoundingClientRect();
            const minX = -window.innerWidth + playerRect.width + 10;
            const maxX = 10;
            const minY = -window.innerHeight + playerRect.height + 10;
            const maxY = 10;

            xOffset = Math.max(minX, Math.min(maxX, xOffset));
            yOffset = Math.max(minY, Math.min(maxY, yOffset));

            setTranslate(xOffset, yOffset, miniPlayer);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

// --- TOAST NOTIFICATIONS WRAPPER ---
function showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    
    // Icon based on notification level
    let icon = '';
    if (type === 'success') {
        icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
        icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Automatically trigger slide-out and remove elements
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, duration);
}
