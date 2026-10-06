import requests
import json
import time

cloud_name = "dlmpk5juu"
upload_preset = "rhythmx_unsigned"

url = f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload"
print(f"Uploading to {url}...")

with open("test_song.webm", "rb") as f:
    files = {"file": f}
    data = {"upload_preset": upload_preset}
    res = requests.post(url, files=files, data=data)
    print(res.json())
