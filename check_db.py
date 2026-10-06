from pymongo import MongoClient

MONGO_URI = "mongodb://basudevmuna111_db_user:ATX8v1jqKRIaLp4n@ac-cjfja3z-shard-00-00.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-01.bmn6i8j.mongodb.net:27017,ac-cjfja3z-shard-00-02.bmn6i8j.mongodb.net:27017/RhythmX?ssl=true&replicaSet=atlas-dg44kv-shard-0&authSource=admin&retryWrites=true&w=majority&appName=RhythmX"
client = MongoClient(MONGO_URI)
db = client.RhythmX
songs_col = db.songs

print(f"Total songs in DB: {songs_col.count_documents({})}")
