# CodeAlpha_MusicPlayer: AuraPlayer

**AuraPlayer** is a responsive, glassmorphic, production-quality Web Music Player inspired by Spotify, Apple Music, and modern design systems (Vercel, Linear, and Framer). Built entirely using semantic HTML5, modern CSS3 variables/effects, and Vanilla ES6+ JavaScript, AuraPlayer is a showcases premium frontend design, smooth 60 FPS motion design, and high-performance Web Audio API analysis.

---


## 📸 Interface Design

- **Theme support**: Premium Dark Mode (Default) & Elegant Light Mode.
- **Visuals**: Animated Aurora gradient backdrops, floating stardust particles, soft card glow, and glassmorphic panels.
- **Art Rotation**: Album covers smoothly rotate while playing and pause on stop, scaling slightly on hover.

---

## 🚀 Key Features

* 📊 **Web Audio Visualizer**: Uses the Web Audio API (`AnalyserNode`) to build a high-performance radial soundwave visualizer around the album artwork in real-time.
* 🎛️ **Comprehensive Playback Controls**: Play, Pause, Prev, Next, Stop, Shuffle, and three Repeat modes (Off, Repeat All, Repeat One).
* ⚡ **Adjustable Playback Speed**: Accelerate or decelerate tracks (0.5x, 1.0x, 1.5x, 2.0x).
* 📂 **Custom MP3 Importer**: Drag, drop, or load your own local audio files. The player parses them, extracts metadata durations, and inserts them into the queue.
* ↕️ **Drag & Drop Playlist**: Interactively re-order the queue by dragging tracks to custom positions.
* 🔍 **Smart Live Search & Categories**: Real-time filtering matching by Title, Artist, Album, and Genre. It also queries the **Deezer API** (from the public API list catalog) in the background with a 500ms debounce. If Deezer is geoblocked locally, it silently falls back to the **iTunes Search API**, rendering global music search results instantly. Users can play global tracks directly or add them (`+`) to their local queue.
* 💖 **Favorites & Recents Tracker**: Maintain your favorite tracks locally and access the last 10 recently played songs.
* 📱 **Intersection Mini-Player**: Scrolling past the main player reveals a floating mini-player with drag-and-drop repositioning and full controls.
* 💾 **Local Storage State Persistence**: Remembers volume levels, theme, shuffle/repeat preferences, favorites, customized queue order, and resumes the last-played song from its exact timestamp upon reload.
* ⌨️ **Keyboard Shortcuts System**: Complete keyboard control map.
* 🔔 **Interactive Toasts**: Clean overlay notification popups for system actions, success states, and error alerts.

---

## 🎛️ Keyboard Shortcuts

| Shortcut Key | Action |
| --- | --- |
| `Space` | Toggle Play / Pause |
| `&larr; Arrow Left` | Previous Song |
| `&rarr; Arrow Right` | Next Song |
| `&uarr; Arrow Up` | Volume Up (+5%) |
| `&darr; Arrow Down` | Volume Down (-5%) |
| `S` | Toggle Shuffle Mode |
| `R` | Cycle Repeat Modes (Off / All / One) |
| `M` | Mute / Unmute Volume |
| `F` | Toggle Favorite Status |
| `?` | Toggle Shortcuts Legend Legend |

---

## 📁 Folder Structure

```
CodeAlpha_MusicPlayer/
│── index.html              # Main Markup Skeleton
│── style.css               # Premium CSS Stylesheet
│── script.js              # Playback Engine & Custom Controllers
│── download_assets.py      # Script to setup/download royalty-free media assets
│── README.md               # Project documentation
└── assets/
    ├── songs/              # Preloaded sample MP3 audio tracks
    ├── covers/             # Preloaded artwork images
    └── icons/              # Dynamic SVGs (embedded in code)
```

---

## 🛠️ Technologies Used

1. **HTML5**: Semantic tags (`aside`, `main`, `footer`), ARIA attributes, file streams.
2. **CSS3**: CSS Custom variables, Blur filters (`backdrop-filter`), Radial gradients, multi-axis keyframes, fluid animations.
3. **Vanilla JavaScript (ES6+)**: Web Audio API (`AudioContext`, `AnalyserNode`, `OscillatorNode`), Intersection Observer, Pointer Event Drag listener, HTML5 Drag & Drop API, Local Storage API.

---

## 🔧 Installation & How to Run

### Step 1: Clone or extract the folder
Make sure all project files are kept in their workspace directory.

### Step 2: Download preloaded media assets (Optional but recommended)
To download the royalty-free songs and cover images, run the asset downloader using Python:
```bash
python download_assets.py
```
*Note: If Python is not installed or internet is not available, the player fallback is pre-configured to use synthetic melody generators and retrieve online assets dynamically.*

### Step 3: Run the Player
Double-click `index.html` to open it in your browser, or launch it with a local development server like Live Server (VS Code), or command line:
```bash
npx live-server
```

---

## 📈 Future Improvements
- **Lyrics syncing**: Dynamic scrolling lyrics matching song playback timestamps (`.lrc` files).
- **ID3 Metadata Parser**: Parse local file uploads automatically for album metadata tags.
- **Playlist Creator**: Create custom user folders and folders within Local Storage/IndexedDB.

---

## 📄 License
This project is licensed under the MIT License.

## 👤 Author
Developed as part of the CodeAlpha Frontend Web Development Internship.
