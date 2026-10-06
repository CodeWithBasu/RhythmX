import os
import requests
from pymongo import MongoClient
import yt_dlp
from datetime import datetime

MONGO_URI = "mongodb://basudevmuna111_db_user:ATX8v1jqKRIaLp4n@ac-cjfja3z-shard-00-00.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-01.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-02.bmn6i8j.mongodb.net:27017/RhythmX?ssl=true&replicaSet=atlas-dg44kv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=RhythmX"
client = MongoClient(MONGO_URI)
db = client.RhythmX
songs_col = db.songs

cloud_name = "dlmpk5juu"
upload_preset = "rhythmx_unsigned"
upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload"

songs_to_download = {
    "Hindi 90s": [
        "Tujhe Dekha To Yeh Jaana Sanam",
        "Ek Ladki Ko Dekha To",
        "Chura Ke Dil Mera",
        "Pehla Nasha",
        "Tum Paas Aaye Kuch Kuch Hota Hai",
        "Dil To Pagal Hai title track",
        "Baazigar O Baazigar",
        "Ae Mere Humsafar Baazigar"
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
    "English": [
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

def download_and_insert():
    for language, song_list in songs_to_download.items():
        for song in song_list:
            query = f"ytsearch1:{song} audio"
            print(f"Processing: {query}")
            
            ydl_opts = {
                'format': '251/bestaudio', # Opus webm
                'outtmpl': '%(id)s.%(ext)s',
                'noplaylist': True,
                'quiet': True,
                'match_filter': yt_dlp.utils.match_filter_func("duration < 420") # skip > 7 mins
            }
            
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(query, download=True)
                    entries = info.get('entries', []) if 'entries' in info else [info]
                    
                    for entry in entries:
                        if not entry: continue
                        title = entry.get('title')
                        artist = entry.get('channel', 'Unknown Artist')
                        duration = entry.get('duration', 0)
                        thumbnail = entry.get('thumbnail')
                        filename = f"{entry.get('id')}.webm"
                        
                        if not os.path.exists(filename):
                            continue
                            
                        print(f"Uploading {title} to Cloudinary...")
                        secure_url = upload_to_cloudinary(filename)
                        
                        if secure_url:
                            # Insert to MongoDB
                            songs_col.insert_one({
                                "title": song, # Use our clean title instead of YouTube title
                                "artist": artist.replace(' - Topic', '').replace(' VEVO', ''),
                                "url": secure_url,
                                "imageUrl": thumbnail,
                                "language": language,
                                "duration": duration,
                                "uploadedBy": "auto-seeder",
                                "uploadedByEmail": "system@rhythmx.com",
                                "createdAt": datetime.utcnow()
                            })
                            print(f"Inserted {song} into MongoDB.")
                        
                        # Clean up local file
                        os.remove(filename)
            except Exception as e:
                print(f"Error processing {query}: {e}")
                # cleanup any leftover webm files
                for f in os.listdir('.'):
                    if f.endswith('.webm'):
                        os.remove(f)

if __name__ == "__main__":
    download_and_insert()
