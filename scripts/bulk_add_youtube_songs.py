import os
import requests
from pymongo import MongoClient
import yt_dlp
from datetime import datetime
import concurrent.futures
import threading

MONGO_URI = "mongodb://basudevmuna111_db_user:ATX8v1jqKRIaLp4n@ac-cjfja3z-shard-00-00.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-01.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-02.bmn6i8j.mongodb.net:27017/RhythmX?ssl=true&replicaSet=atlas-dg44kv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=RhythmX"
client = MongoClient(MONGO_URI)
db = client.RhythmX
songs_col = db.songs

cloud_name = "dlmpk5juu"
upload_preset = "rhythmx_unsigned"
upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload"

songs_to_download = {
    "Hindi 90s": [
        "Ek Ladki Ko Dekha To",
        "Chura Ke Dil Mera",
        "Pehla Nasha",
        "Tum Paas Aaye Kuch Kuch Hota Hai",
        "Dil To Pagal Hai title track",
        "Baazigar O Baazigar"
    ],
    "Hindi Modern": [
        "Tum Kya Mile Rocky Aur Rani",
        "Chaleya Jawan",
        "O Maahi Dunki",
        "Apna Bana Le Bhediya",
        "Kesariya Brahmastra",
        "Tere Hawaale Laal Singh Chaddha",
        "Husn Anuv Jain",
        "Heeriye Arijit Singh"
    ],
    "English Trending": [
        "Flowers Miley Cyrus",
        "As It Was Harry Styles",
        "Kill Bill SZA",
        "Anti-Hero Taylor Swift",
        "Vampire Olivia Rodrigo",
        "Cruel Summer Taylor Swift",
        "Water Tyla",
        "Texas Hold Em Beyonce"
    ],
    "Punjabi": [
        "Excuses AP Dhillon",
        "Brown Munde AP Dhillon",
        "Lover Diljit Dosanjh",
        "Pasoori Ali Sethi",
        "Cheques Shubh",
        "No Love Shubh",
        "Obsessed Riar Saab",
        "Lemonade Diljit Dosanjh"
    ]
}

def upload_to_cloudinary(file_path):
    with open(file_path, "rb") as f:
        res = requests.post(upload_url, files={"file": f}, data={"upload_preset": upload_preset})
        data = res.json()
        return data.get("secure_url")

def process_song(language, song):
    # Check if we already inserted it
    if songs_col.find_one({"title": song}):
        print(f"Skipping {song} (already in DB)")
        return
        
    query = f"ytsearch1:{song} audio"
    print(f"Processing: {song}")
    
    # Use thread ID in outtmpl to avoid file collisions
    tid = threading.get_ident()
    
    ydl_opts = {
        'format': '251/bestaudio',
        'outtmpl': f'%(id)s_{tid}.%(ext)s',
        'noplaylist': True,
        'quiet': True,
        'match_filter': yt_dlp.utils.match_filter_func("duration < 420")
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(query, download=True)
            entries = info.get('entries', []) if 'entries' in info else [info]
            
            for entry in entries:
                if not entry: continue
                title = entry.get('title')
                artist = entry.get('channel', 'Unknown Artist').replace(' - Topic', '').replace(' VEVO', '')
                duration = entry.get('duration', 0)
                thumbnail = entry.get('thumbnail')
                filename = f"{entry.get('id')}_{tid}.webm"
                
                if not os.path.exists(filename):
                    continue
                    
                print(f"Uploading {song} to Cloudinary...")
                secure_url = upload_to_cloudinary(filename)
                
                if secure_url:
                    songs_col.insert_one({
                        "title": song,
                        "artist": artist,
                        "url": secure_url,
                        "imageUrl": thumbnail,
                        "language": language,
                        "duration": duration,
                        "uploadedBy": "auto-seeder",
                        "uploadedByEmail": "system@rhythmx.com",
                        "createdAt": datetime.utcnow()
                    })
                    print(f"Inserted {song} into MongoDB.")
                
                os.remove(filename)
    except Exception as e:
        print(f"Error processing {song}: {e}")

def download_and_insert():
    tasks = []
    for language, song_list in songs_to_download.items():
        for song in song_list:
            tasks.append((language, song))
            
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(process_song, t[0], t[1]) for t in tasks]
        concurrent.futures.wait(futures)
        
    print("ALL FINISHED!")
    
    # Cleanup any stray webm
    for f in os.listdir('.'):
        if f.endswith('.webm'):
            try: os.remove(f)
            except: pass

if __name__ == "__main__":
    download_and_insert()
