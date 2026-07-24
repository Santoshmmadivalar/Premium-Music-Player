import os
import urllib.request

# Define directories
workspace_dir = r"c:\Users\Santosh Madiwalar\OneDrive\Desktop\Premium Spotify-Inspired Music Player"
assets_dir = os.path.join(workspace_dir, "assets")
songs_dir = os.path.join(assets_dir, "songs")
covers_dir = os.path.join(assets_dir, "covers")
icons_dir = os.path.join(assets_dir, "icons")

# Create directories
for directory in [songs_dir, covers_dir, icons_dir]:
    os.makedirs(directory, exist_ok=True)
    print(f"Ensured directory: {directory}")

# List of assets to download (Royalty-free public domain / CC tracks and images)
assets = {
    "songs": [
        {
            "name": "song1.mp3",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            "name": "song2.mp3",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            "name": "song3.mp3",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        },
        {
            "name": "song4.mp3",
            "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
        }
    ],
    "covers": [
        {
            "name": "cover1.jpg",
            "url": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&fit=crop"
        },
        {
            "name": "cover2.jpg",
            "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&h=400&fit=crop"
        },
        {
            "name": "cover3.jpg",
            "url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&h=400&fit=crop"
        },
        {
            "name": "cover4.jpg",
            "url": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&h=400&fit=crop"
        }
    ]
}

# Download function
def download_file(url, dest_path):
    try:
        print(f"Downloading {url} to {dest_path}...")
        # Add User-Agent header to avoid HTTP 403 Forbidden errors
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            with open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Successfully downloaded {dest_path}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

# Perform downloads
for song in assets["songs"]:
    dest = os.path.join(songs_dir, song["name"])
    if not os.path.exists(dest):
        download_file(song["url"], dest)
    else:
        print(f"Song {song['name']} already exists, skipping.")

for cover in assets["covers"]:
    dest = os.path.join(covers_dir, cover["name"])
    if not os.path.exists(dest):
        download_file(cover["url"], dest)
    else:
        print(f"Cover {cover['name']} already exists, skipping.")

print("Asset setup script completed!")
