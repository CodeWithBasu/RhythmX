from jiosaavn import JioSaavn
import asyncio
import json

async def test():
    client = JioSaavn()
    res = await client.get_song_direct_link("aRZbUYD7")
    print(res)

asyncio.run(test())
