import re

with open('components/music-visualizer.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update the parent container to conditionally drop max-w-2xl
old_container = """        {/* SCROLLABLE BELOW CARDS SECTION */}
        {isPlayerExpanded && (
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8 relative z-20 pb-32">"""
new_container = """        {/* SCROLLABLE BELOW CARDS SECTION */}
        {isPlayerExpanded && (
          <div className={`w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8 relative z-20 pb-32 transition-all duration-500 ${isLyricsExpanded ? 'max-w-5xl' : 'max-w-2xl'}`}>"""
code = code.replace(old_container, new_container)

# 2. Update the lyrics card to not use fixed, but just become large
old_lyrics_class = r'className=\{\`bg-\[\#603B2C\] rounded-2xl shadow-2xl transition-all duration-500 \$\{isLyricsExpanded \? "fixed inset-0 z-\[100\] rounded-none flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-24" : "relative p-6 overflow-hidden group"\}\`\}'
new_lyrics_class = r'className={`bg-[#603B2C] shadow-2xl transition-all duration-500 ${isLyricsExpanded ? "rounded-3xl min-h-[85vh] flex flex-col pt-12 pb-24 px-6 sm:px-12 md:px-16" : "rounded-2xl relative p-6 max-h-[300px] overflow-hidden group"}`}'
code = re.sub(old_lyrics_class, new_lyrics_class, code)

# 3. We also need to remove the overflow-y-auto from the lyrics card itself if we want the WHOLE PAGE to scroll
# Because if the lyrics card is `min-h-[85vh]`, all the lyrics will just expand the card's height naturally!
# And the user scrolls the PAGE to read them.
old_lyrics_inner = r'<div className=\{\`flex flex-col gap-3 relative \$\{isLyricsExpanded \? \'flex-1 overflow-y-auto hide-scrollbar\' : \'max-h-\[300px\] overflow-hidden\'\}\`\} id="lyrics-container">'
new_lyrics_inner = r'<div className="flex flex-col gap-3 relative" id="lyrics-container">'
code = re.sub(old_lyrics_inner, new_lyrics_inner, code)

# 4. We need to hide the other cards when lyrics are expanded to provide a focus mode!
# Find the ABOUT THE ARTIST CARD
old_artist = """            {/* ABOUT THE ARTIST CARD */}
            <div className="bg-[#181818] rounded-2xl overflow-hidden shadow-2xl">"""
new_artist = """            {/* ABOUT THE ARTIST CARD */}
            <div className={`bg-[#181818] rounded-2xl overflow-hidden shadow-2xl transition-opacity duration-500 ${isLyricsExpanded ? 'hidden' : 'block'}`}>"""
code = code.replace(old_artist, new_artist)

# Find the EXPLORE ARTIST CARD
old_explore = """            {/* EXPLORE ARTIST CARD */}
            <div className="bg-[#181818] rounded-2xl p-6 shadow-2xl mb-8">"""
new_explore = """            {/* EXPLORE ARTIST CARD */}
            <div className={`bg-[#181818] rounded-2xl p-6 shadow-2xl mb-8 transition-opacity duration-500 ${isLyricsExpanded ? 'hidden' : 'block'}`}>"""
code = code.replace(old_explore, new_explore)


with open('components/music-visualizer.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied seamless inline expansion layout")
