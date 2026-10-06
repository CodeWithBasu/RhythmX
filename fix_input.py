import sys

with open('app/settings/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_html = """                    <div className="relative group cursor-pointer shrink-0" onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}>
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#111] ring-4 ring-white/5 group-hover:ring-purple-500/30 transition-all duration-300 ${isUploadingAvatar ? 'opacity-50' : ''}`}>
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity duration-200 ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isUploadingAvatar ? (
                          <div className="w-6 h-6 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white/80" />
                        )}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                    </div>"""

new_html = """                    <label className={`relative group cursor-pointer shrink-0 ${isUploadingAvatar ? 'pointer-events-none' : ''}`}>
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#111] ring-4 ring-white/5 group-hover:ring-purple-500/30 transition-all duration-300 ${isUploadingAvatar ? 'opacity-50' : ''}`}>
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity duration-200 ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isUploadingAvatar ? (
                          <div className="w-6 h-6 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white/80" />
                        )}
                      </div>
                      <input type="file" onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                    </label>"""

if old_html in code:
    code = code.replace(old_html, new_html)
    with open('app/settings/page.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fixed input file click bubbling bug")
else:
    print("Could not find old html block")
