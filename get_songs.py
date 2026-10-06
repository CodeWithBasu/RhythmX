from pymongo import MongoClient

MONGO_URI = "mongodb://basudevmuna111_db_user:ATX8v1jqKRIaLp4n@ac-cjfja3z-shard-00-00.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-01.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-02.bmn6i8j.mongodb.net:27017/RhythmX?ssl=true&replicaSet=atlas-dg44kv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=RhythmX"
client = MongoClient(MONGO_URI)
db = client.RhythmX
songs_col = db.songs

songs = list(songs_col.find({}, {"title": 1, "artist": 1, "language": 1, "_id": 0}))

with open("all_songs.txt", "w", encoding="utf-8") as f:
    for s in songs:
        lang = s.get("language", "Unknown")
        title = s.get("title", "Unknown")
        artist = s.get("artist", "Unknown Artist")
        f.write(f"[{lang}] {title} - {artist}\n")

print("Done")
