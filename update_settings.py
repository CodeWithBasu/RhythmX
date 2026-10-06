import sys
import re

with open('app/settings/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state variables
state_vars = """  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Settings States
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);
  const [streamingQuality, setStreamingQuality] = useState('High Quality');
  const [crossfade, setCrossfade] = useState(3);
  
  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHardware = localStorage.getItem('rhythmx_hardware_accel');
      if (savedHardware !== null) setHardwareAcceleration(savedHardware === 'true');
      
      const savedLyrics = localStorage.getItem('rhythmx_show_lyrics');
      if (savedLyrics !== null) setShowLyrics(savedLyrics === 'true');
      
      const savedQuality = localStorage.getItem('rhythmx_streaming_quality');
      if (savedQuality) setStreamingQuality(savedQuality);
      
      const savedCrossfade = localStorage.getItem('rhythmx_crossfade');
      if (savedCrossfade) setCrossfade(parseInt(savedCrossfade, 10));
    }
  }, []);
  
  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rhythmx_hardware_accel', hardwareAcceleration.toString());
      localStorage.setItem('rhythmx_show_lyrics', showLyrics.toString());
      localStorage.setItem('rhythmx_streaming_quality', streamingQuality);
      localStorage.setItem('rhythmx_crossfade', crossfade.toString());
    }
  }, [hardwareAcceleration, showLyrics, streamingQuality, crossfade]);"""

code = code.replace("  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);", state_vars)

# 2. Update Hardware Acceleration toggle
hw_old = """                     <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                       <div>
                         <h3 className="font-semibold text-sm">Hardware Acceleration</h3>
                         <p className="text-xs text-white/40 mt-1">Smoother 3D visualizer animations</p>
                       </div>
                       <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer shadow-inner">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                       </div>
                     </div>"""
hw_new = """                     <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer" onClick={() => setHardwareAcceleration(!hardwareAcceleration)}>
                       <div>
                         <h3 className="font-semibold text-sm">Hardware Acceleration</h3>
                         <p className="text-xs text-white/40 mt-1">Smoother 3D visualizer animations</p>
                       </div>
                       <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${hardwareAcceleration ? 'bg-purple-500' : 'bg-black/50 border border-white/10'}`}>
                         <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${hardwareAcceleration ? 'right-1 bg-white' : 'left-1 bg-white/30'}`} />
                       </div>
                     </div>"""
code = code.replace(hw_old, hw_new)

# 3. Update Show Lyrics toggle
lyric_old = """                     <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                       <div>
                         <h3 className="font-semibold text-sm">Show Lyrics by Default</h3>
                         <p className="text-xs text-white/40 mt-1">Auto-open lyrics panel when available</p>
                       </div>
                       <div className="w-12 h-6 bg-black/50 border border-white/10 rounded-full relative cursor-pointer">
                         <div className="absolute left-1 top-1 w-4 h-4 bg-white/30 rounded-full" />
                       </div>
                     </div>"""
lyric_new = """                     <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer" onClick={() => setShowLyrics(!showLyrics)}>
                       <div>
                         <h3 className="font-semibold text-sm">Show Lyrics by Default</h3>
                         <p className="text-xs text-white/40 mt-1">Auto-open lyrics panel when available</p>
                       </div>
                       <div className={`w-12 h-6 rounded-full relative shadow-inner transition-colors duration-300 ${showLyrics ? 'bg-purple-500' : 'bg-black/50 border border-white/10'}`}>
                         <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${showLyrics ? 'right-1 bg-white' : 'left-1 bg-white/30'}`} />
                       </div>
                     </div>"""
code = code.replace(lyric_old, lyric_new)

# 4. Update Audio Quality section
audio_old = """                   <div>
                     <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-4 ml-1">
                       Streaming Quality
                     </label>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {['Data Saver', 'High Quality', 'Lossless'].map(quality => (
                         <button key={quality} className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${quality === 'High Quality' ? 'bg-gradient-to-b from-purple-500/20 to-purple-500/5 border-purple-500/30 text-white shadow-lg shadow-purple-500/10' : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.06] hover:text-white/80'}`}>
                           {quality}
                         </button>
                       ))}
                     </div>
                   </div>
                   
                   <div className="pt-6 border-t border-white/5">
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="font-semibold text-sm">Audio Crossfade</h3>
                       <span className="text-purple-400 text-sm font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">3s</span>
                     </div>
                     <p className="text-xs text-white/40 mb-5">Smooth transition between tracks</p>
                     <input type="range" min="0" max="10" defaultValue="3" className="w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
                   </div>"""
audio_new = """                   <div>
                     <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-4 ml-1">
                       Streaming Quality
                     </label>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {['Data Saver', 'High Quality', 'Lossless'].map(quality => (
                         <button 
                           key={quality} 
                           onClick={() => setStreamingQuality(quality)}
                           className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${streamingQuality === quality ? 'bg-gradient-to-b from-purple-500/20 to-purple-500/5 border-purple-500/30 text-white shadow-lg shadow-purple-500/10' : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.06] hover:text-white/80'}`}
                         >
                           {quality}
                         </button>
                       ))}
                     </div>
                   </div>
                   
                   <div className="pt-6 border-t border-white/5">
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="font-semibold text-sm">Audio Crossfade</h3>
                       <span className="text-purple-400 text-sm font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{crossfade}s</span>
                     </div>
                     <p className="text-xs text-white/40 mb-5">Smooth transition between tracks</p>
                     <input 
                       type="range" 
                       min="0" 
                       max="10" 
                       value={crossfade} 
                       onChange={(e) => setCrossfade(parseInt(e.target.value, 10))}
                       className="w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" 
                     />
                   </div>"""
code = code.replace(audio_old, audio_new)

with open('app/settings/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated settings page to make toggles and sliders functional")
