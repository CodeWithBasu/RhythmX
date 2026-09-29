"use client"

import { SlideTabs } from "@/components/ui/slide-tabs";
import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Home, Search, Library, PlusCircle, Database, Share2, Users, SkipBack, SkipForward, Shuffle, Repeat, Headphones, Github, Linkedin, Globe, ChevronDown, User, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { useAuth } from "@/contexts/AuthContext";
import ElasticSlider from "@/components/ui/elastic-slider"
import TextType from "@/components/ui/TextType"
import { useDevice } from "@/hooks/use-device"
import { getPusherClient } from "@/lib/pusher-client"

const DEFAULT_TEXT = [
  "LOST IN THE NEON LIGHTS",
  "FEEL THE RHYTHM IN YOUR MIND",
  "ECHOES OF A CYBER CITY",
  "WE ARE INFINITE"
];

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || '';

// Dynamic Bar Color Generator
const getBarColors = (index: number, total: number, height: number, isPlaying: boolean, theme: string = "neon") => {
  if (!isPlaying) return { bg: 'rgba(255, 255, 255, 0.2)', glow: 'transparent' };
  
  let hue, saturation = 90, lightness = 60 + (height * 5);

  if (theme === "synthwave") {
    // Hot Pink (320) -> Orange (30) -> Yellow (60)
    hue = (320 + ((index / total) * 100)) % 360; 
  } else if (theme === "matrix") {
    // Pure Hacker Green
    hue = 120;
    saturation = 100;
  } else if (theme === "ocean") {
    // Deep Blue to Bright Cyan
    hue = 220 - ((index / total) * 60); 
  } else {
    // default: neon (Violet to Pink to Orange)
    hue = 280 - ((index / total) * 250); 
  }
  
  return {
    bg: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    glow: `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.min(0.25, height * 0.25)})`
  };
};


const GridAlbumArt = ({ song }: { song: any }) => {
  const [imgUrl, setImgUrl] = React.useState<string | null>(song.imageUrl || null)

  React.useEffect(() => {
    if (song.imageUrl) return;

    let isMounted = true;
    const fetchArt = async () => {
      try {
        const cleanTitle = song.title.replace('~/', '').trim();
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanTitle)}&entity=song&limit=1`);
        const data = await res.json();
        if (isMounted && data.results && data.results.length > 0) {
           setImgUrl(data.results[0].artworkUrl100.replace('100x100', '300x300'));
        }
      } catch (e) {
      }
    };
    fetchArt();
    return () => { isMounted = false; };
  }, [song.title, song.imageUrl]);

  if (imgUrl) {
    return <img src={imgUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
  }

  return <Headphones className="text-white/10 w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
}




const SongCarousel = ({ title, songs, onPlay }: { title: string, songs: any[], onPlay: (song: any) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [songs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateScrollState, 400);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <div className="relative group -mx-4">
        
        {/* Left Shadow & Arrow */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent z-[5] pointer-events-none" />
        )}
        <button 
          onClick={() => scroll('left')}
          className={`hidden md:flex absolute left-2 top-[60px] sm:top-[80px] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105 ${!canScrollLeft && 'hidden'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div ref={scrollRef} onScroll={updateScrollState} className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar px-4 scroll-smooth relative z-[1]">
          {songs.map((song) => (
            <div 
              key={`carousel-${title}-${song.id}`} 
              onClick={() => onPlay(song)} 
              className="snap-start shrink-0 w-[120px] sm:w-[160px] cursor-pointer group/item"
            >
              <div className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] mb-3">
                <div className="w-full h-full rounded-md overflow-hidden relative shadow-lg">
                  <GridAlbumArt song={song} />
                  <div className="absolute top-2 left-2">
                    <img src="/rhythmx-logo.png" className="w-4 h-4 rounded-sm opacity-80" />
                  </div>
                </div>
              </div>
              <h3 className="font-medium text-white/90 text-sm truncate">{song.title}</h3>
              <p className="text-white/60 text-xs line-clamp-2 mt-1 leading-tight">{song.artist || 'Various Artists'}</p>
            </div>
          ))}
        </div>

        {/* Right Shadow & Arrow */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#121212] via-[#121212]/80 to-transparent z-[5] pointer-events-none" />
        )}
        <button 
          onClick={() => scroll('right')}
          className={`hidden md:flex absolute right-2 top-[60px] sm:top-[80px] -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center bg-black/60 hover:bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 text-white shadow-xl hover:scale-105 ${!canScrollRight && 'hidden'}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
export default function Component() {

  const { user } = useAuth();
  const device = useDevice()
  // 64 bars on mobile is the sweet spot—wider than before, but not edge-to-edge
  const activeBars = device === 'mobile' ? 64 : device === 'tablet' ? 72 : 80;
  
  const barsRef = useRef(activeBars)
  
  useEffect(() => {
    barsRef.current = activeBars
    setAudioData(new Array(activeBars).fill(0.01))
  }, [activeBars])

  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState<number[]>(() => new Array(80).fill(0.01))
  const [currentTrack, setCurrentTrack] = useState<string>("~/ 2 Million")
  const [hasAudio, setHasAudio] = useState(true) // Ahora true por defecto
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [showInitialAnimation, setShowInitialAnimation] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [songs, setSongs] = useState<any[]>([])
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("home");
    const [isAddingSong, setIsAddingSong] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [syncOffset, setSyncOffset] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [newSongMeta, setNewSongMeta] = useState({ title: '', artist: '', url: '', imageUrl: '', language: 'English' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const localFileRef = useRef<HTMLInputElement>(null)
  const [theme, setTheme] = useState("neon")
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [is8DMode, setIs8DMode] = useState(false)
  const [albumArtUrl, setAlbumArtUrl] = useState<string | null>(null)
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)

  
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAdminLogin = () => {
    const password = prompt("Enter Security Key to unlock Admin Panel:");
    if (password === "rhythmxadmin") {
      setIsAdmin(true);
      alert("Admin Access Granted.");
    } else if (password !== null) {
      alert("Invalid Security Key.");
    }
  };

  const [partyId, setPartyId] = useState<string | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [currentSongObj, setCurrentSongObj] = useState<any>(null)
  const [hasJoinedMobile, setHasJoinedMobile] = useState(false)

  // Real-Time Social Reactions
  const sharedChannelRef = useRef<any>(null);
  const [reactions, setReactions] = useState<{id: string, emoji: string, x: number}[]>([]);
  
  const addReaction = (emoji: string) => {
    const id = Date.now().toString() + Math.random().toString();
    const x = Math.random() * 80 + 10; // Random X from 10vw to 90vw
    setReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 2500);
  };

  const handleSendReaction = (emoji: string) => {
    addReaction(emoji);
    if (sharedChannelRef.current) {
      sharedChannelRef.current.trigger('client-reaction', { emoji });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const pId = params.get('party')
      if (pId) {
        setPartyId(pId)
        setIsHost(false)
      }
    }
  }, [])

  const currentSongObjRef = useRef(currentSongObj);
  useEffect(() => { currentSongObjRef.current = currentSongObj; }, [currentSongObj]);

  const isInitializedRef = useRef(isInitialized);
  useEffect(() => { isInitializedRef.current = isInitialized; }, [isInitialized]);

  // Party Guest Sync via Pusher
  useEffect(() => {
    if (!partyId || isHost || !hasJoinedMobile) return;
    
    // Initial fetch to get current state before websocket connects
    const fetchInitial = async () => {
      const startFetch = Date.now();
      try {
        const res = await fetch(`${API_BASE}/api/party?id=${partyId}`);
        if (res.ok) {
          const data = await res.json();
          processSyncEvent(data, (Date.now() - startFetch) / 2000);
        }
      } catch (e) {
        console.error("Initial sync error", e);
      }
    };
    fetchInitial();

    const pusher = getPusherClient();
    const channelName = `private-party-${partyId}`;
    let channel = pusher.channel(channelName);
    if (!channel) {
       channel = pusher.subscribe(channelName);
    }

    channel.bind('client-sync', (data: any) => {
      // Direct client-to-client transmission bypasses API delays perfectly. Use 50ms default transmission latency.
      processSyncEvent(data, 0.05);
    });

    channel.bind('client-reaction', (data: any) => {
      addReaction(data.emoji);
    });

    sharedChannelRef.current = channel;

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [partyId, isHost, hasJoinedMobile]);

  // Immediately apply Manual Sync Calibration to audio playback when slider is moved
  const prevSyncOffsetRef = useRef(syncOffset);
  useEffect(() => {
    if (audioRef.current && !isHost && partyId) {
      const diff = syncOffset - prevSyncOffsetRef.current;
      if (diff !== 0) {
        audioRef.current.currentTime += diff;
        prevSyncOffsetRef.current = syncOffset;
      }
    }
  }, [syncOffset, isHost, partyId]);

  const processSyncEvent = async (data: any, latency = 0) => {
    const hasNewSong = data.song && (!currentSongObjRef.current || currentSongObjRef.current.id !== data.song.id);
    
    let timeSinceUpdate = 0;
    if (data.serverTime && data.updatedAt) {
      timeSinceUpdate = (data.serverTime - data.updatedAt) / 1000;
    }
    // Apply manual user sync adjustment offset to eliminate hardware/bluetooth latency
    const expectedTime = data.isPlaying ? data.currentTime + Math.max(0, timeSinceUpdate) + latency + syncOffset : data.currentTime;

    if (hasNewSong) {
      setCurrentSongObj(data.song);
      
      let songUrl = data.song.url;
      if (!songUrl) {
        songUrl = `${API_BASE}/api/songs/${data.song.id}/stream`;
      }
      if (audioRef.current) {
        audioRef.current.src = songUrl;
        audioRef.current.load();
        audioRef.current.currentTime = expectedTime;
        setIsBuffering(true);
        
        if (audioContextRef.current?.state === "suspended") {
           await audioContextRef.current.resume();
        }
        if (!isInitializedRef.current) {
           await initializeAudioContext();
        }
        
        if (data.isPlaying) {
           const p = audioRef.current.play();
           if (p !== undefined) p.catch(() => {});
           setIsPlaying(true);
        }
        setCurrentTrack(`~/ ${data.song.title}`);
        setHasAudio(true);
      }
    } else if (audioRef.current) {
       const drift = expectedTime - audioRef.current.currentTime;
       
       // Higher drift threshold (1.5s) prevents normal network connection jitter from causing microscopic stutters and lagginess every second.
       // Only scrub jumps (like Host seeking) will trigger this snap!
       if (Math.abs(drift) > 1.5) {
          audioRef.current.currentTime = expectedTime;
       }
       
       // Sync state
       if (data.isPlaying && audioRef.current.paused) {
          // Absolute synchronization snap upon Resume Action!
          audioRef.current.currentTime = expectedTime;
          const p = audioRef.current.play();
          if (p !== undefined) p.catch(() => {});
          setIsPlaying(true);
       } else if (!data.isPlaying && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsPlaying(false);
       }
    }
  };

  // Party Host Sync
  const channelRef = useRef<any>(null);
  const pendingSyncRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!partyId || !isHost || !audioRef.current || !currentSongObj) return;
    
    // Connect Host to private channel for Client Events
    const pusher = getPusherClient();
    const channelName = `private-party-${partyId}`;
    let channel = pusher.channel(channelName);
    if (!channel) {
       channel = pusher.subscribe(channelName);
    }
    channelRef.current = channel;
    sharedChannelRef.current = channel;

    channel.bind('client-reaction', (data: any) => {
      addReaction(data.emoji);
    });

    // Broadcast function
    const broadcast = async () => {
      if (!audioRef.current) return;
      
      const payload = {
        id: partyId,
        song: currentSongObj,
        currentTime: audioRef.current.currentTime,
        isPlaying: !audioRef.current.paused,
        clientTime: Date.now()
      };

      // 1. Instantly ping all guests without waiting for server response!
      channelRef.current?.trigger('client-sync', payload);

      // 2. Async save to database
      try {
        await fetch(`${API_BASE}/api/party`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.error("Failed to host sync", e);
      }
    };

    // 1. Send constant baseline syncs slightly faster (every 1 second instead of 2 seconds)
    const interval = setInterval(broadcast, 1000);
    
    // 2. Send INSTANT sync pulses exactly when Host interacts (Play, Pause, Scrubbing)
    const handleAction = () => {
       if (pendingSyncRef.current) clearTimeout(pendingSyncRef.current);
       pendingSyncRef.current = setTimeout(broadcast, 10);
    };

    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.addEventListener('play', handleAction);
      audioEl.addEventListener('pause', handleAction);
      audioEl.addEventListener('seeked', handleAction);
    }
    
    return () => {
      clearInterval(interval);
      if (pendingSyncRef.current) clearTimeout(pendingSyncRef.current);
      if (audioEl) {
        audioEl.removeEventListener('play', handleAction);
        audioEl.removeEventListener('pause', handleAction);
        audioEl.removeEventListener('seeked', handleAction);
      }
      pusher.unsubscribe(channelName);
    };
  }, [partyId, isHost, currentSongObj]);

  const startParty = async () => {
    if (partyId) {
      const url = new URL(window.location.href);
      url.searchParams.set('party', partyId);
      navigator.clipboard.writeText(url.toString());
      alert("Party link copied to clipboard! Share it with your friends.");
      return;
    }
    
    if (!currentSongObj) {
      alert("Please select and play a song from your library first to start a party!");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/party`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          song: currentSongObj,
          currentTime: audioRef.current?.currentTime || 0,
          isPlaying: audioRef.current ? !audioRef.current.paused : false
        })
      });
      const data = await res.json();
      setPartyId(data.id);
      setIsHost(true);
      
      const url = new URL(window.location.href);
      url.searchParams.set('party', data.id);
      window.history.pushState({}, '', url.toString());
      
      navigator.clipboard.writeText(url.toString());
      alert("Party started! The link has been copied to your clipboard. Share it to sync playback!");
    } catch (e) {
      alert("Failed to start party. Please make sure the database is accessible.");
    }
  }

  // Synced Lyrics State
  interface LyricLine {
    time: number // in seconds
    text: string
  }
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1)
  const [isFetchingLyrics, setIsFetchingLyrics] = useState(false)

  // Parse standard .lrc file format into our array structure
  const parseLRC = (lrcString: string): LyricLine[] => {
    const lines = lrcString.split('\n')
    const parsedLyrics: LyricLine[] = []
    
    // Regex matches [mm:ss.xx]
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

    lines.forEach(line => {
      const match = timeRegex.exec(line)
      if (match) {
        const minutes = parseInt(match[1], 10)
        const seconds = parseInt(match[2], 10)
        const milliseconds = parseInt(match[3], 10)
        
        const timeInSeconds = minutes * 60 + seconds + (milliseconds / (match[3].length === 2 ? 100 : 1000))
        const text = line.replace(timeRegex, '').trim()
        
        if (text) {
          parsedLyrics.push({ time: timeInSeconds, text })
        }
      }
    })
    
    return parsedLyrics
  }

  // Fetch true synced lyrics from LRCLIB
  const fetchSyncedLyrics = async (songTitleRaw: string) => {
    try {
      setIsFetchingLyrics(true)
      setLyrics([])
      setCurrentLyricIndex(-1)
      
      // Clean up title (remove "The Weeknd" part from "Starboy (The Weeknd)" if possible)
      // For LRCLIB, usually just throwing the full string works well on their search endpoint
      let searchTitle = songTitleRaw.replace('~/', '').trim()
      
      const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(searchTitle)}`)
      if (!res.ok) throw new Error("Network response was not ok")
      
      const data = await res.json()
      
      if (data && data.length > 0) {
        // Find best match with synced lyrics
        const bestSynced = data.find((d: any) => d.syncedLyrics)
        // Find best match with plain lyrics
        const bestPlain = data.find((d: any) => d.plainLyrics)

        if (bestSynced) {
          const parsed = parseLRC(bestSynced.syncedLyrics)
          setLyrics(parsed)
          console.log("Successfully loaded synced lyrics from LRCLIB!")
        } else if (bestPlain) {
          console.log("No synced lyrics found. Falling back to plain lyrics...")
          const rawLines = bestPlain.plainLyrics
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => l.length > 0)
          
          // Estimate duration (fallback to 3 minutes if API doesn't provide it)
          const songDuration = bestPlain.duration || 180 
          
          // Generate pseudo-synced timestamps evenly distributed across the track
          const parsed: LyricLine[] = rawLines.map((text: string, index: number) => ({
            time: (index / Math.max(rawLines.length, 1)) * songDuration,
            text
          }))
          setLyrics(parsed)
        } else {
          console.log("No lyrics found for this track.")
        }
      } else {
        console.log("No lyrics found for this track.")
      }
    } catch (error) {
      console.error("Failed to fetch lyrics:", error)
    } finally {
      setIsFetchingLyrics(false)
    }
  }

  // Fetch Album Art
  const fetchAlbumArt = async (title: string) => {
    try {
      const cleanTitle = title.replace('~/', '').trim();
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanTitle)}&entity=song&limit=1`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Get high-res version of the artwork
        const highResUrl = data.results[0].artworkUrl100.replace('100x100', '600x600');
        setAlbumArtUrl(highResUrl);
      } else {
        setAlbumArtUrl(null);
      }
    } catch (e) {
      console.error('Failed to fetch album art', e);
      setAlbumArtUrl(null);
    }
  }

  // Listen for track changes to refetch lyrics and album art
  useEffect(() => {
    if (currentTrack && currentTrack !== "~/ 2 Million") {
      fetchSyncedLyrics(currentTrack)
      fetchAlbumArt(currentTrack)
    }
  }, [currentTrack])



  const fetchSongs = () => { setIsLoadingSongs(true);
    fetch(`${API_BASE}/api/songs`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setSongs(data)
        setError(null)
      })
      .catch(err => {
        console.error("Failed to load songs", err)
        setError("Network error. Please check your connection.")
      }).finally(() => setIsLoadingSongs(false))
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file)
        setNewSongMeta({
          ...newSongMeta,
          title: file.name.replace(/\.[^/.]+$/, "")
        })
      }
    }
  }

  // Audio refs
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar audio por defecto al montar el componente
  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
      // Usar la URL raw de GitHub para el archivo MP3
      audioRef.current.src = "https://raw.githubusercontent.com/Railly/drive/main/2_Million.mp3"
      audioRef.current.load()
    }
  }, [])

  const initializeAudioContext = async () => {
    if (!audioRef.current || isInitialized) return

    try {
      console.log("Initializing audio context...")

      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Resume if suspended
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume()
      }

      // Create analyser
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 1024
      analyserRef.current.smoothingTimeConstant = 0.2

      // Create source - only if it doesn't exist
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
        pannerRef.current = audioContextRef.current.createStereoPanner()
        
        // Connect: source -> analyser -> panner -> destination
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(pannerRef.current)
        pannerRef.current.connect(audioContextRef.current.destination)
      }

      setIsInitialized(true)
      console.log("Audio context initialized successfully")
    } catch (error) {
      console.error("Error initializing audio context:", error)
    }
  }

  // Función para suavizar datos (efecto ola)
  const smoothData = (data: number[]) => {
    const smoothed = [...data]

    // Aplicar suavizado entre barras vecinas para efecto ola
    for (let i = 1; i < smoothed.length - 1; i++) {
      smoothed[i] = (data[i - 1] + data[i] * 2 + data[i + 1]) / 4
    }

    return smoothed
  }

  // Función para actualizar datos con efecto OLA - AMBOS LADOS SINTÉTICOS
  const updateAudioData = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    analyserRef.current.getByteFrequencyData(dataArray)

    const bars = barsRef.current
    const halfBars = Math.floor(bars / 2)
    const rawData = []
    const usefulFreqRange = Math.floor(bufferLength * 0.3)

    // Calcular nivel general de audio para threshold
    let totalEnergy = 0
    for (let i = 0; i < usefulFreqRange; i++) {
      totalEnergy += dataArray[i]
    }
    const averageEnergy = totalEnergy / usefulFreqRange
    const energyThreshold = 50 // Mantener alto

    for (let i = 0; i < bars; i++) {
      let value = 0

      if (i < halfBars) {
        // Lado izquierdo: AHORA TAMBIÉN SINTÉTICO
        const freqIndex = Math.floor((i / halfBars) * usefulFreqRange)
        const baseValue = dataArray[freqIndex] || 0

        // Añadir variación sintética al lado izquierdo también
        const timeOffset = Date.now() * 0.006 + i * 0.12 // Diferentes parámetros que el derecho
        const synthetic = Math.sin(timeOffset) * 0.25 + Math.cos(timeOffset * 1.5) * 0.15
        value = baseValue * (0.8 + synthetic) // Ligeramente diferente al derecho
      } else {
        // Lado derecho: crear datos sintéticos basados en el lado izquierdo
        const mirrorIndex = (bars - 1) - i
        const baseIndex = Math.floor((mirrorIndex / halfBars) * usefulFreqRange)
        const baseValue = dataArray[baseIndex] || 0

        const timeOffset = Date.now() * 0.008 + i * 0.15
        const synthetic = Math.sin(timeOffset) * 0.3 + Math.cos(timeOffset * 1.2) * 0.2
        value = baseValue * (0.7 + synthetic)
      }

      let normalized = value / 255

      // Si el nivel general está muy bajo, no mostrar nada
      if (averageEnergy < energyThreshold) {
        normalized = 0.01
      } else {
        // Amplificación por posición para efecto ola - REDUCIDA 40% MÁS
        const quarterBars = Math.floor(bars / 4)
        if (i < quarterBars) {
          normalized *= 1.5 // Era 2.5, ahora 1.5 (40% menos)
        } else if (i < halfBars) {
          normalized *= 1.2 // Era 2.0, ahora 1.2 (40% menos)
        } else if (i < quarterBars * 3) {
          normalized *= 1.05 // Era 1.75, ahora 1.05 (40% menos)
        } else {
          normalized *= 0.9 // Era 1.5, ahora 0.9 (40% menos)
        }

        // Curva suave para efecto ola
        normalized = Math.pow(Math.max(0, normalized), 0.4)

        // SISTEMA DE NIVELES - CONTRASTE EXTREMO + REDUCCIÓN 40%
        if (normalized > 0.8) {
          // NIVEL SÚPER ALTO: Explosivo - MÁS CONTRASTE
          normalized = Math.pow(normalized, 0.15) * 1.8 // Era 2.0, ahora 1.8 (40% menos) pero curva más agresiva
        } else if (normalized > 0.7) {
          // NIVEL ALTO: Elevado - REDUCIDO
          normalized = Math.pow(normalized, 0.3) * 0.9 // Era 1.5, ahora 0.9 (40% menos)
        } else if (normalized > 0.5) {
          // NIVEL MEDIO-ALTO: Súper reducido para contraste extremo
          normalized = Math.pow(normalized, 0.8) * 0.1 // Era 0.25, ahora 0.1 (60% menos para más contraste)
        } else if (normalized > 0.45) {
          // NIVEL MEDIO-BAJO: Eliminado
          normalized = 0.01
        } else {
          // NIVEL BAJO: Desaparecer
          normalized = 0.01
        }

        // Threshold individual MÁS ESTRICTO
        if (normalized < 0.45) {
          // Era 0.4, ahora 0.45 - más estricto
          normalized = 0.01
        }
      }

      const final = Math.max(0, Math.min(1.0, normalized)) // Cap at 1.0 (100% height)
      rawData.push(final)
    }

    // Aplicar suavizado para efecto ola
    const smoothedData = smoothData(rawData)

    // Aplicar suavizado adicional para olas más fluidas
    const extraSmoothed = smoothData(smoothedData)

    setAudioData(extraSmoothed)
  }

  // useEffect para manejar el loop de visualización
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isPlaying) {
      setIsLooping(true)
      console.log("Starting visualization loop")

      intervalId = setInterval(() => {
        updateAudioData()
      }, 25) // 40 FPS para fluidez de ola
    } else {
      setIsLooping(false)
      console.log("Stopping visualization loop")
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPlaying, isInitialized])

  // 8D Audio Animation Loop
  useEffect(() => {
    let animationFrame: number;
    const animate8D = () => {
      if (is8DMode && pannerRef.current && isPlaying) {
        const time = Date.now() / 1500;
        pannerRef.current.pan.value = Math.sin(time) * 0.8;
      } else if (pannerRef.current) {
        pannerRef.current.pan.value = 0;
      }
      animationFrame = requestAnimationFrame(animate8D);
    };
    if (is8DMode) {
      animate8D();
    } else if (pannerRef.current) {
      pannerRef.current.pan.value = 0;
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [is8DMode, isPlaying]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file")
      return
    }

    try {
      const audioUrl = URL.createObjectURL(file)

      if (audioRef.current) {
        // Stop current playback
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        }

        // Set new source
        audioRef.current.src = audioUrl
        audioRef.current.load()

        setCurrentTrack(`~/ ${file.name.replace(/\.[^/.]+$/, "")}`)
        setHasAudio(true)

        // Trigger initial animation
        setShowInitialAnimation(true)
        setTimeout(() => setShowInitialAnimation(false), 2000)

        console.log("Audio file loaded:", file.name)
      }
    } catch (error) {
      console.error("Error loading audio file:", error)
    }
  }

  const playSong = async (song: any) => {
    setCurrentSongObj(song);
    setAlbumArtUrl(song.imageUrl || null);
    if (audioRef.current) {
      let songUrl = song.url
      if (!songUrl) {
        setIsBuffering(true)
        songUrl = `${API_BASE}/api/songs/${song.id}/stream`
      }

      // Update track info
      audioRef.current.src = songUrl
      audioRef.current.load()
      setCurrentTrack(`~/ ${song.title}`)
      setHasAudio(true)
      
      // Reset visualizer state for new song
      setShowInitialAnimation(true)
      setTimeout(() => setShowInitialAnimation(false), 2000)

      try {
        // Ensure context is initialized
        if (!isInitialized) {
          await initializeAudioContext()
        }
        
        // Ensure context is running
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume()
        }

        // Start playing
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true)
            console.log("Auto-playing:", song.title)
          }).catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error auto-playing song:", error)
            }
            setIsPlaying(false)
          })
        }
      } catch (error) {
        console.error("Error auto-playing song setup:", error)
        setIsPlaying(false)
      }
    }
  }

  const togglePlayback = async () => {
    if (!audioRef.current) return

    try {
      if (!isInitialized) {
        await initializeAudioContext()
      }

      if (audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume()
      }

      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("Playing")
          }).catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error toggling playback:", error)
            }
          })
        }
      } else {
        audioRef.current.pause()
        console.log("Paused")
      }
    } catch (error) {
      console.error("Error toggling playback state:", error)
    }
  }

  const skipForward = () => {
    if (currentSongObj && songs.length > 0) {
      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * songs.length);
        playSong(songs[randomIndex]);
        return;
      }
      const currentIndex = songs.findIndex(s => s.id === currentSongObj.id)
      if (currentIndex !== -1 && currentIndex < songs.length - 1) {
        playSong(songs[currentIndex + 1])
      }
    }
  }

  const skipBackward = () => {
    if (currentSongObj && songs.length > 0) {
      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * songs.length);
        playSong(songs[randomIndex]);
        return;
      }
      const currentIndex = songs.findIndex(s => s.id === currentSongObj.id)
      if (currentIndex > 0) {
        playSong(songs[currentIndex - 1])
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  // Hardware Media Controls (Earbuds, Bluetooth, Lockscreen)
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('previoustrack', () => skipBackward())
      navigator.mediaSession.setActionHandler('nexttrack', () => skipForward())
      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current) audioRef.current.play()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) audioRef.current.pause()
      })

      if (currentSongObj) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSongObj.title || 'Unknown Track',
          artist: 'RhythmX',
          artwork: [
            { src: '/rhythmx-logo.png', sizes: '512x512', type: 'image/png' }
          ]
        })
      }
    }
  }, [currentSongObj, songs])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      console.log("Audio can play")
      setIsBuffering(false)
      if (!isInitialized) {
        initializeAudioContext()
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = (e: any) => {
      console.error("Audio error event:", e)
      setIsPlaying(false)
      setIsBuffering(false)
      if (e.target.error) {
        switch (e.target.error.code) {
          case e.target.error.MEDIA_ERR_ABORTED:
            console.log("Audio playback aborted.")
            break
          case e.target.error.MEDIA_ERR_NETWORK:
            alert("Audio playback error: A network error caused the audio download to fail.")
            break
          case e.target.error.MEDIA_ERR_DECODE:
            alert("Audio playback error: The audio file is corrupted or not supported.")
            break
          case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            alert("Audio playback error: The audio format is not supported or the URL is invalid.")
            break
          default:
            alert("Audio playback error: An unknown error occurred.")
            break
        }
      } else {
        alert("Audio playback error: An unknown error occurred.")
      }
    }

    audio.addEventListener("canplaythrough", handleCanPlay)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [hasAudio, isInitialized])

  
  return (
    <div className="h-[100dvh] w-full bg-[#050505] text-white flex flex-col font-sans overflow-hidden relative">
      
      {/* Home Screen (Only visible if not expanded) */}
      <div className={`flex-1 overflow-y-auto pb-32 transition-opacity duration-300 ${isPlayerExpanded ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100 relative z-10'} bg-[#121212]`}>
        
        {/* Top Header (Spotify Style) */}
        <div className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            {user ? <ProfileDropdown /> : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50"><User className="w-5 h-5" /></div>}
            <button className="bg-[#1ed760] text-black px-4 py-1.5 rounded-full text-sm font-medium">All</button>
            
          </div>
          {isAdmin && (
            <button onClick={() => setIsAddingSong(true)} className="bg-white/10 text-white p-2 rounded-full">
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>

        <main className="px-4 py-2 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Quick Play Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            
            {/* Liked Songs Tile */}
            <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14">
                <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 flex items-center justify-center shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
                <div className="font-bold text-xs text-white truncate">Liked Songs</div>
            </div>

            {isLoadingSongs && [...Array(5)].map((_, i) => (
              <div key={`quick-skel-${i}`} className="bg-white/5 rounded-md flex items-center gap-3 pr-3 overflow-hidden h-14 animate-pulse">
                <div className="w-14 h-14 shrink-0 bg-white/10" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            ))}
            {songs.slice(0, 5).map((song) => (
              <div 
                key={`quick-${song.id}`}
                onClick={() => { playSong(song); setIsPlayerExpanded(true); }}
                className="bg-white/10 hover:bg-white/20 transition-colors rounded-md flex items-center gap-3 pr-3 overflow-hidden cursor-pointer h-14"
              >
                <div className="w-14 h-14 shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.3)] bg-black/40">
                  <GridAlbumArt song={song} />
                </div>
                <div className="font-bold text-xs text-white truncate">{song.title}</div>
              </div>
            ))}
          </div>

          {/* Skeleton Loading Rows */}
            {isLoadingSongs && (
              <>
                <section>
                  <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={`hits-skel-${i}`} className="shrink-0 w-[120px] sm:w-[160px] animate-pulse">
                        <div className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] mb-3 bg-white/10 rounded-md" />
                        <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </section>
                <section className="mt-8">
                  <div className="h-6 w-32 bg-white/10 rounded mb-4 animate-pulse" />
                  <div className="flex overflow-x-hidden gap-4 pb-4 -mx-4 px-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={`chill-skel-${i}`} className="shrink-0 w-[120px] sm:w-[160px] animate-pulse">
                        <div className="w-[120px] sm:w-[160px] h-[120px] sm:h-[160px] mb-3 bg-white/10 rounded-md" />
                        <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-white/10 rounded w-1/3" />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
            
            {/* Today's biggest hits */}
            {songs.length > 0 && (
              <SongCarousel 
                title="Today's biggest hits" 
                songs={songs.slice(0, 8)} 
                onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
              />
            )}

            {/* Chill */}
            {songs.length > 2 && (
              <SongCarousel 
                title="Chill" 
                songs={songs.slice(2, 10)} 
                onPlay={(song) => { playSong(song); setIsPlayerExpanded(true); }} 
              />
            )}
          </main>
      </div>

{/* MINI PLAYER (Floating at Bottom) */}
      <AnimatePresence>
        {!isPlayerExpanded && hasAudio && currentSongObj && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-[70px] left-2 right-2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] bg-[#3d1515] rounded-lg p-2 flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-[#4d1a1a] transition-colors z-[60] border-b-2 border-white/10"
            onClick={() => setIsPlayerExpanded(true)}
          >
            {/* Progress Bar (Spotify Style) */}
            <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-white/20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
            </div>

            {/* Mini Art */}
            <div className="w-10 h-10 shrink-0 rounded overflow-hidden shadow-md">
              <GridAlbumArt song={currentSongObj} />
            </div>
            
            {/* Mini Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="text-[13px] font-bold text-white truncate">{currentSongObj.title}</div>
              <div className="text-[11px] text-white/70 truncate">{currentSongObj.artist || 'Unknown Artist'}</div>
            </div>

            {/* Mini Controls */}
            <div className="flex items-center gap-3 pr-2 shrink-0 text-white" onClick={(e) => e.stopPropagation()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <button 
                onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                className="w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAVIGATION BAR */}
      <div className={`fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-0 sm:right-0 z-[50] flex justify-center transition-transform duration-300 ${isPlayerExpanded ? 'translate-y-[150%]' : 'translate-y-0'}`}>
         <SlideTabs 
           activeId={activeTab}
           onChange={(id) => {
             if (id === 'create') {
                 setIsAddingSong(true);
             } else {
                 setActiveTab(id);
             }
           }} 
           tabs={[
             { id: 'home', label: 'Home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
             { id: 'search', label: 'Search', icon: <Search className="w-4 h-4 sm:w-5 sm:h-5" /> },
             { id: 'library', label: 'Library', icon: <Library className="w-4 h-4 sm:w-5 sm:h-5" /> },
             ...(isAdmin ? [{ id: 'create', label: 'Create', icon: <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> }] : [])
           ]}
         />
      </div>
      
      {/* EXPANDED PLAYER (Visualizer) */}
      <div 
        className={`fixed inset-0 z-50 bg-[#0C0414] flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isPlayerExpanded ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Collapse Button */}
        <div className="absolute top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-6 bg-gradient-to-b from-black/80 to-transparent">
          <button 
            onClick={() => setIsPlayerExpanded(false)}
            className="p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/5 hover:scale-105"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          
          {isAdmin && (
             <button onClick={() => setIsAddingSong(true)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               <Upload className="w-5 h-5" />
             </button>
          )}
        </div>

        {/* Visualizer Canvas & Bars */}
        <div className="flex-1 relative flex flex-col items-center justify-center w-full min-h-[45vh]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#0C0414]/50 to-[#0C0414] pointer-events-none" />
          
          {!hasAudio && (
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none z-10 px-4">
              <TextType 
                text={["RHYTHMX", "SONIC REALITY"]} 
                typingSpeed={80} 
                 
                className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] uppercase tracking-[0.2em] text-center"
              />
            </div>
          )}

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[40vh] max-h-[400px] flex items-end justify-center gap-[1px] sm:gap-[2px] md:gap-1 px-4 z-10">
            {audioData.slice(0, activeBars).map((height, index) => {
            const colors = getBarColors(index, activeBars, height, isPlaying, theme);
            return (
              <motion.div
                key={index}
                className="rounded-t-sm flex-1 max-w-[4px] sm:max-w-[5px] md:max-w-[6px] lg:max-w-[8px]"
                style={{
                  backgroundColor: colors.bg,
                  opacity: height > 0 ? 1 : 0,
                  boxShadow: isPlaying ? `0 0 ${Math.floor(height * 6)}px ${colors.glow}` : 'none'
                }}
                initial={{ scaleX: 0 }}
                animate={{
                  height: `${height * 100}%`,
                  opacity: height > 0 ? 1 : 0,
                  scaleX: showInitialAnimation ? 1 : 1,
                }}
                transition={{
                  height: { type: "spring", stiffness: height > 0 ? 400 : 200, damping: height > 0 ? 25 : 35, mass: 0.2 },
                  opacity: { duration: height > 0 ? 0.1 : 0.8, ease: "easeOut" },
                  scaleX: { duration: 2, delay: Math.abs(index - 40) * 0.015, ease: "easeOut" },
                }}
              />
            );
          })}
          </div>
        </div>

        {/* Current Song Info & Controls */}
        <div className="w-full bg-black/40 backdrop-blur-2xl border-t border-white/5 pt-6 pb-12 px-6 sm:px-12 relative z-20 shrink-0">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                <motion.div 
                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 shrink-0 bg-white/5 flex items-center justify-center relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {albumArtUrl ? (
                        <img src={albumArtUrl} alt="Album Art" className="w-full h-full object-cover" />
                    ) : (
                        <Headphones className="w-8 h-8 sm:w-12 sm:h-12 text-white/40" />
                    )}
                    {is8DMode && (
                      <div className="absolute top-2 right-2 bg-purple-500/80 backdrop-blur text-[10px] px-2 py-0.5 rounded text-white font-bold tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                        8D
                      </div>
                    )}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                    <motion.div 
                      className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white truncate drop-shadow-md mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                        {currentTrack}
                    </motion.div>
                    {currentSongObj?.artist && (
                      <motion.div 
                        className="text-sm sm:text-base md:text-lg text-white/60 font-medium truncate tracking-wide"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentSongObj.artist}
                      </motion.div>
                    )}
                </div>
              </div>

              <div className="flex flex-col gap-4 min-w-[280px]">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40 font-medium w-10 text-right">{formatTime(currentTime)}</span>
                  <div 
                    className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer relative group"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const percent = (e.clientX - rect.left) / rect.width
                      if(duration) {
                        const newTime = percent * duration
                        if (audioRef.current) audioRef.current.currentTime = newTime
                        setCurrentTime(newTime)
                      }
                    }}
                  >
                    <motion.div 
                      className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                      layoutId="progress"
                    />
                    <div className="absolute top-0 bottom-0 left-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity w-full" />
                  </div>
                  <span className="text-xs text-white/40 font-medium w-10">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between px-2">
                  <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2.5 rounded-full transition-all ${isShuffle ? 'text-purple-400 bg-purple-500/10' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                    <Shuffle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button onClick={() => {
                    const idx = songs.findIndex(s => s.id === currentSongObj?.id);
                    if(idx > 0) playSong(songs[idx-1]);
                  }} className="p-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button 
                    onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                  >
                    {isPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                  <button onClick={() => {
                    const idx = songs.findIndex(s => s.id === currentSongObj?.id);
                    if(idx < songs.length - 1) playSong(songs[idx+1]);
                  }} className="p-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button onClick={() => setIsRepeat(!isRepeat)} className={`p-2.5 rounded-full transition-all ${isRepeat ? 'text-purple-400 bg-purple-500/10' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}>
                    <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extras (Theme / 8D Audio) */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/5">
              <button onClick={() => setIs8DMode(!is8DMode)} className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold tracking-wider transition-all ${is8DMode ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                <span className="flex items-center gap-2"><Headphones className="w-3 h-3 sm:w-4 sm:h-4" />8D AUDIO {is8DMode ? 'ON' : 'OFF'}</span>
              </button>
              <div className="flex gap-2 bg-white/5 p-1 rounded-full">
                {["neon", "synthwave", "matrix", "ocean"].map((t) => (
                  <button key={t} onClick={() => setTheme(t)} className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${theme === t ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Modals & Audio Element */}
      <AnimatePresence>
        {isAddingSong && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            {!user ? (
                <div className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <Database className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
                  <p className="text-white/60 mb-6 text-sm">Please log in or sign up first to upload and store music in the RhythmX library.</p>
                  <div className="flex gap-4 w-full">
                    <button type="button" onClick={() => setIsAddingSong(false)} className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">Cancel</button>
                    <Link href="/signin" className="flex-1 py-3 px-4 bg-[#C084FC] hover:bg-[#A855F7] text-white rounded-lg transition-colors text-sm font-medium text-center shadow-[0_0_15px_rgba(192,132,252,0.3)]">Sign In</Link>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white mb-6">Add Song to Library</h2>
                  <form onSubmit={async (e) => {
                  e.preventDefault()
                  if (selectedFile) {
                    setIsBuffering(true) // Loading State
                    
                    const audio = new Audio()
                    const blobUrl = URL.createObjectURL(selectedFile)
                    audio.src = blobUrl
                    
                    audio.onloadedmetadata = async () => {
                      const duration = Math.floor(audio.duration)
                      URL.revokeObjectURL(blobUrl)
                      
                      try {
                        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlmpk5juu'; 
                        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'rhythmx_unsigned'; 
                        
                        setUploadProgress(10);
                        
                        // 1. Upload Cover Image (if exists)
                        let uploadedImageUrl = null;
                        if (newSongMeta.imageUrl && newSongMeta.imageUrl.startsWith('data:image')) {
                           const imgFormData = new FormData();
                           imgFormData.append('file', newSongMeta.imageUrl);
                           imgFormData.append('upload_preset', uploadPreset);
                           const imgRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                             method: 'POST',
                             body: imgFormData
                           });
                           if (imgRes.ok) {
                             const imgData = await imgRes.json();
                             uploadedImageUrl = imgData.secure_url;
                           }
                        }

                        // 2. Upload Audio File (with progress)
                        const formData = new FormData();
                        formData.append('file', selectedFile);
                        formData.append('upload_preset', uploadPreset);
                        
                        await new Promise((resolve, reject) => {
                          const xhr = new XMLHttpRequest();
                          xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
                          
                          xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                              const progress = 10 + Math.round((event.loaded / event.total) * 85); // 10-95%
                              setUploadProgress(progress);
                            }
                          };
                          
                          xhr.onload = async () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                              const res = JSON.parse(xhr.responseText);
                              const uploadedUrl = res.secure_url;
                              setUploadProgress(96);
                              
                              // 3. Save to MongoDB
                              const songData = {
                                title: newSongMeta.title,
                                artist: newSongMeta.artist || "Unknown Artist",
                                language: newSongMeta.language,
                                url: uploadedUrl,
                                imageUrl: uploadedImageUrl || null,
                                duration: duration
                              };
                              
                              const token = await user?.getIdToken(true);
                              const dbRes = await fetch(`${API_BASE}/api/songs`, {
                                method: 'POST',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(songData),
                              });
                              
                              if (dbRes.ok) {
                                const dbData = await dbRes.json();
                                setSongs([...songs, dbData.song]);
                                resolve(null);
                              } else {
                                reject(new Error('Failed to save to database'));
                              }
                            } else {
                              reject(new Error('Cloudinary upload failed'));
                            }
                          };
                          
                          xhr.onerror = () => reject(new Error('Network error'));
                          xhr.send(formData);
                        });

                        setIsBuffering(false);
                        setUploadProgress(0);
                        setIsAddingSong(false);
                        setSelectedFile(null);
                        setNewSongMeta({ title: "", artist: "", url: "", imageUrl: "", language: "English" });
                      } catch (err) {
                        setIsBuffering(false);
                        setUploadProgress(0);
                        setError("Failed to upload song. Check console.");
                        console.error(err);
                      }
                    }
                  }
                }}>
                  <div className="flex flex-col gap-4">
                    
                    {/* Cover Art Preview */}
                    {newSongMeta.imageUrl && (
                      <div className="flex justify-center mb-2">
                        <img src={newSongMeta.imageUrl} alt="Cover Preview" className="w-24 h-24 rounded-lg object-cover shadow-lg border border-white/10" />
                      </div>
                    )}

                    <input 
                      type="file" 
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFile(file)
                          setNewSongMeta({ ...newSongMeta, title: file.name.replace(/.[^/.]+$/, "") })
                          
                          // Dynamically import jsmediatags and Extract ID3 Tags (Cover Art)
                          const jsmediatags = require('jsmediatags/dist/jsmediatags.min.js');
                          if(jsmediatags) {
                            jsmediatags.read(file, {
                              onSuccess: function(tag: any) {
                                const picture = tag.tags.picture;
                                if (picture) {
                                  let base64String = "";
                                  for (let i = 0; i < picture.data.length; i++) {
                                      base64String += String.fromCharCode(picture.data[i]);
                                  }
                                  const base64 = btoa(base64String);
                                  const imageUrl = `data:${picture.format};base64,${base64}`;
                                  setNewSongMeta(prev => ({ ...prev, imageUrl, artist: tag.tags.artist || prev.artist, title: tag.tags.title || prev.title }));
                                }
                              },
                              onError: function(error: any) {
                                console.log("No ID3 tags found.", error);
                              }
                            });
                          }
                        }
                      }}
                      className="text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
                    />
                    <input 
                      type="text" 
                      placeholder="Song Title" 
                      value={newSongMeta.title}
                      onChange={(e) => setNewSongMeta({...newSongMeta, title: e.target.value})}
                      className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Artist (Optional)" 
                      value={newSongMeta.artist || ''}
                      onChange={(e) => setNewSongMeta({...newSongMeta, artist: e.target.value})}
                      className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    />
                    <select
                      value={newSongMeta.language}
                      onChange={(e) => setNewSongMeta({...newSongMeta, language: e.target.value})}
                      className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Korean">Korean</option>
                      <option value="Instrumental">Instrumental</option>
                    </select>
                    
                    <div className="flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsAddingSong(false)
                          setSelectedFile(null)
                          setNewSongMeta({ title: "", artist: "", url: "", imageUrl: "", language: "English" })
                        }}
                        className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!selectedFile || isBuffering || uploadProgress > 0}
                        className="flex-1 py-3 px-4 bg-[#C084FC] hover:bg-[#A855F7] text-white rounded-lg transition-colors text-sm font-medium shadow-[0_0_15px_rgba(192,132,252,0.3)] disabled:opacity-50"
                      >
                        {uploadProgress > 0 ? `Uploading (${uploadProgress}%)...` : isBuffering ? "Processing..." : "Add to Library"}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <audio
          ref={audioRef}
          crossOrigin="anonymous"
          onLoadedData={() => setIsBuffering(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
        />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}









