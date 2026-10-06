import sys
import re

with open('app/settings/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add useRef to import
code = code.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect, useRef } from 'react';")

# Find the start of the component body
setup_marker = "export default function SettingsPage() {\n"
setup_idx = code.find(setup_marker)
if setup_idx != -1:
    setup_idx += len(setup_marker)
    # Add state and ref
    new_state = """  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploadingAvatar(true);
    setSaveMessage('Uploading picture...');
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlmpk5juu';
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'rhythmx_unsigned';
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const imageUrl = data.secure_url;
      
      await updateProfile(user, { photoURL: imageUrl });
      
      setSaveMessage('Profile picture updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (err) {
      console.error(err);
      setSaveMessage('Failed to update picture.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
"""
    code = code[:setup_idx] + new_state + code[setup_idx:]
    
    # Now find the avatar UI block and attach onClick + hidden input
    avatar_ui_old = """                    <div className="relative group cursor-pointer shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#111] ring-4 ring-white/5 group-hover:ring-purple-500/30 transition-all duration-300">
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Camera className="w-6 h-6 text-white/80" />
                      </div>
                    </div>"""
                    
    avatar_ui_new = """                    <div className="relative group cursor-pointer shrink-0" onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}>
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
                    
    code = code.replace(avatar_ui_old, avatar_ui_new)
    
    with open('app/settings/page.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Added avatar upload functionality")
else:
    print("Could not find setup marker")
