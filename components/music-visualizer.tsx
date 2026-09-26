"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Database, Share2, Users, SkipBack, SkipForward, Shuffle, Repeat, Headphones, Github, Linkedin, Globe } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [isAddingSong, setIsAddingSong] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [syncOffset, setSyncOffset] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [newSongMeta, setNewSongMeta] = useState({ title: '', artist: '', url: '', language: 'English' })
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



  const fetchSongs = () => {
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
      })
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
    <div className="h-[100dvh] w-full bg-[#0C0414] flex flex-col overflow-hidden font-sans">
      {/* Top Section: Visualizer & Player (approx 40-45%) */}
      <div className="flex-none h-[45vh] md:h-[50vh] relative flex flex-col items-center justify-between pb-6 pt-20 bg-gradient-to-b from-black to-[#0C0414] shrink-0">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-transparent">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleAdminLogin}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <img 
                src="/rhythmx-logo.png" 
                alt="RhythmX Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300" 
              />
              <div className="absolute inset-0 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/0 transition-colors" />
            </div>
            <div className="flex flex-col justify-center ml-1">
              <div className="flex items-center text-xl sm:text-3xl tracking-tight uppercase text-white leading-none mb-1" style={{ fontFamily: "'Pixer', monospace" }}>
                RHYTHM<span className="text-[#C084FC] ml-[1px] relative">
                  X
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] sm:h-[3px] bg-[#C084FC]"></span>
                </span>
              </div>
              <div className="text-[#888888] text-[8px] sm:text-[10px] tracking-[0.2em]" style={{ fontFamily: "'Pixer', monospace" }}>
                SONIC REALITY ENGINE
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <ProfileDropdown />
            {isAdmin && (
                <button
                  onClick={() => setIsAddingSong(true)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-600/20 hover:bg-purple-600/40 text-white rounded-lg border border-purple-500/40 transition-all duration-200"
                >
                  <span className="text-[10px] sm:text-sm font-bold tracking-tight">+ Upload</span>
                </button>
            )}
          </div>
        </div>

        {/* Hidden File Input & Audio Element */}
        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
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

        {/* Dynamic Synced Lyrics Display (Overlay) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 overflow-hidden pt-10 px-4">
            <AnimatePresence mode="wait">
            {lyrics.length > 0 && currentLyricIndex !== -1 && (
                <motion.div
                key={`lyric-${currentLyricIndex}`}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)", y: 10 }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)", y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center w-full"
                >
                <span className="text-xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 leading-tight">
                    {lyrics[currentLyricIndex].text}
                </span>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        {/* Audio Visualizer Bars */}
        <div className="flex items-end justify-center gap-[1px] sm:gap-[2px] md:gap-1 w-full max-w-5xl px-4 overflow-hidden flex-1 mb-4 z-0">
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

        {/* Player Controls Section */}
        <div className="w-full max-w-3xl px-6 flex flex-col items-center z-20">
            {/* Track Info */}
            <motion.div
                className="flex items-center gap-4 mb-4 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {albumArtUrl ? (
                    <img src={albumArtUrl} alt="Album Art" className="w-12 h-12 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)] object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-white/40" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="text-lg sm:text-xl font-bold tracking-wider text-white truncate drop-shadow-md">
                        {currentTrack}
                    </div>
                    {currentSongObj?.artist && (
                        <div className="text-xs text-white/50 truncate">{currentSongObj.artist}</div>
                    )}
                </div>
            </motion.div>

            {/* Seek Bar */}
            <div className="w-full mb-4">
                <div className="flex justify-between w-full text-[10px] font-medium text-white/40 mb-1">
                    <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
                </div>
                <ElasticSlider
                    value={currentTime}
                    maxValue={duration || 100}
                    startingValue={0}
                    onChange={(val) => setCurrentTime(val)}
                    onDragEnd={(val) => { if (audioRef.current) audioRef.current.currentTime = val }}
                    leftIcon={null}
                    rightIcon={null}
                    className="w-full"
                    theme={theme}
                />
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 text-white w-full">
                <motion.button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2 transition-colors ${isShuffle ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-white/30 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >
                    <Shuffle size={18} />
                </motion.button>
        
                <motion.button onClick={skipBackward} className="p-2 text-white/70 hover:text-white transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <SkipBack size={24} />
                </motion.button>
        
                <motion.div
                    onClick={togglePlayback}
                    className="flex items-center justify-center w-14 h-14 bg-white text-black rounded-full cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                    {isBuffering ? (
                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black ml-1">
                        <motion.path
                            d={isPlaying ? "M6 4h4v16H6V4zm8 0h4v16h-4V4z" : "M8 5v14l11-7z"}
                            fill="currentColor"
                            animate={{ d: isPlaying ? "M6 4h4v16H6V4zm8 0h4v16h-4V4z" : "M8 5v14l11-7z" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                    </svg>
                    )}
                </motion.div>
        
                <motion.button onClick={skipForward} className="p-2 text-white/70 hover:text-white transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <SkipForward size={24} />
                </motion.button>
        
                <motion.button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={`p-2 transition-colors ${isRepeat ? 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' : 'text-white/30 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >
                    <Repeat size={18} />
                </motion.button>
            </div>
        </div>
      </div>

      {/* Bottom Section: Scrollable Grid (approx 55-60%) */}
      <div className="flex-1 w-full bg-[#05010a] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] overflow-y-auto relative z-10 border-t border-white/5 pb-24">
        
        {/* Toggles Container */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-6 pb-2 border-b border-white/5">
          <motion.button
            onClick={() => setIs8DMode(!is8DMode)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${is8DMode ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <Headphones size={12} />
            8D Audio {is8DMode ? 'ON' : 'OFF'}
          </motion.button>
  
          {device === 'mobile' && (
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-white/5 border border-white/10 text-white/70 text-[10px] uppercase font-bold tracking-wider rounded-full px-4 py-1.5 outline-none hover:bg-white/10 transition-colors cursor-pointer text-center appearance-none"
            >
              <option value="neon" className="bg-neutral-900">Theme: Neon</option>
              <option value="synthwave" className="bg-neutral-900">Theme: Synth</option>
              <option value="matrix" className="bg-neutral-900">Theme: Matrix</option>
              <option value="ocean" className="bg-neutral-900">Theme: Ocean</option>
            </select>
          )}

          {partyId && !isHost && (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <span className="text-white/40 text-[9px] font-mono tracking-widest uppercase">Sync: {(syncOffset > 0 ? "+" : "") + (syncOffset * 1000).toFixed(0)}ms</span>
                <input 
                  type="range" min="-0.5" max="0.5" step="0.01" value={syncOffset}
                  onChange={(e) => setSyncOffset(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-white/20 rounded-full appearance-none outline-none cursor-pointer" 
                />
            </div>
          )}
        </div>

        {/* Library Grid */}
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Discover</h2>
                
                <div className="relative w-full sm:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text"
                        placeholder="Search songs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111]/50 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 mb-6 rounded-xl text-center text-sm text-red-400 bg-red-400/10 border border-red-400/20">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.language?.toLowerCase().includes(searchQuery.toLowerCase())).map((song) => (
                    <div 
                        key={song.id} 
                        onClick={() => playSong(song)}
                        className="group relative bg-white/[0.02] rounded-2xl p-3 hover:bg-white/[0.06] transition-all cursor-pointer border border-white/5 hover:border-purple-500/30 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col"
                    >
                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-900/40 to-black/80 mb-3 flex items-center justify-center relative overflow-hidden">
                            {/* We don't have album art natively stored yet, so use a placeholder icon */}
                            <Headphones className="text-white/10 w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                            
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white ml-1">
                                        <path d="M8 5v14l11-7z" fill="currentColor"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <h3 className="font-bold text-white/90 text-sm truncate group-hover:text-white transition-colors">{song.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-white/40 text-xs truncate pr-2">{song.artist || 'Unknown Artist'}</p>
                            {song.language && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 shrink-0 font-medium tracking-wide uppercase">
                                    {song.language}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {songs.length > 0 && songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.language?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="p-12 text-center flex flex-col items-center">
                    <Database className="w-12 h-12 text-white/10 mb-4" />
                    <div className="text-white/40 text-sm">No songs found matching "{searchQuery}"</div>
                </div>
            )}
            
            {songs.length === 0 && !error && (
                <div className="p-12 text-center flex flex-col items-center">
                    <Database className="w-12 h-12 text-white/10 mb-4" />
                    <div className="text-white/30 text-base font-medium">Your library is empty</div>
                    <div className="text-white/20 text-xs mt-2">Upload some tracks to get started.</div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-8 mb-8 pb-12 flex flex-col items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-5">
                <motion.a href="https://github.com/CodeWithBasu" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/50 hover:text-white transition-all">
                    <Github size={18} />
                </motion.a>
                <motion.a href="https://www.linkedin.com/in/basudev-moharana/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/40 text-white/50 hover:text-blue-400 transition-all">
                    <Linkedin size={18} />
                </motion.a>
                <motion.a href="https://basudev.vercel.app" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-green-500/20 hover:border-green-500/40 text-white/50 hover:text-green-400 transition-all">
                    <Globe size={18} />
                </motion.a>
            </div>
            <div className="text-[8px] text-white/10 tracking-[0.4em] uppercase text-center">
                &copy; 2026 RhythmX // Designed by Basudev <br/>
                <span className="opacity-50 mt-1 block">Beyond Visualization</span>
            </div>
        </div>
      </div>

      {/* Overlays (Unchanged) */}
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
                    setIsBuffering(true)
                    const audio = new Audio()
                    const blobUrl = URL.createObjectURL(selectedFile)
                    audio.src = blobUrl
                    audio.onloadedmetadata = async () => {
                      const dur = audio.duration
                      const formData = new FormData()
                      formData.append("file", selectedFile)
                      formData.append("title", newSongMeta.title)
                      formData.append("artist", newSongMeta.artist || "Unknown Artist")
                      formData.append("language", newSongMeta.language)
                      formData.append("duration", dur.toString())
                      
                      const token = await user?.getIdToken(true);
                      
                      const xhr = new XMLHttpRequest();
                      xhr.open('POST', `${API_BASE}/api/songs`, true);
                      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                      
                      xhr.upload.onprogress = (e) => {
                        if (e.lengthComputable) {
                          setUploadProgress(Math.round((e.loaded / e.total) * 100));
                        }
                      };
                      
                      xhr.onload = async () => {
                        setIsBuffering(false)
                        setUploadProgress(0)
                        if (xhr.status === 200) {
                          const resData = JSON.parse(xhr.responseText);
                          setSongs([...songs, resData])
                          setIsAddingSong(false)
                          setSelectedFile(null)
                          setNewSongMeta({ title: "", artist: "", url: "", language: "English" })
                        } else {
                          setError("Failed to upload song. Missing auth or server error.")
                        }
                      };
                      xhr.send(formData);
                    }
                  }
                }}>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="file" 
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedFile(file)
                          setNewSongMeta({ ...newSongMeta, title: file.name.replace(/\.[^/.]+$/, "") })
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
                          setNewSongMeta({ title: "", artist: "", url: "", language: "English" })
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

      {partyId && !isHost && !hasJoinedMobile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center max-w-sm">
            <div className="w-20 h-20 mb-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You've been invited!</h2>
            <p className="text-white/60 mb-8 text-sm">Join the live listening session to synchronize playback.</p>
            <button 
              onClick={async () => { await initializeAudioContext(); setHasJoinedMobile(true); }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Join Party
            </button>
          </motion.div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: "100vh", opacity: 0, scale: 0.5, x: `${r.x}vw` }}
              animate={{ y: "-10vh", opacity: [0, 1, 1, 0], scale: 1.5 + Math.random(), rotate: Math.random() * 60 - 30 }}
              exit={{ opacity: 0 }} transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute text-5xl drop-shadow-2xl"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {partyId && (hasJoinedMobile || isHost) && (
        <div className="fixed right-4 sm:right-8 bottom-24 sm:bottom-1/2 sm:translate-y-1/2 z-50 flex flex-col gap-3">
          {["🔥", "💖", "🎉", "👀"].map((emoji) => (
            <button
              key={emoji} onClick={() => handleSendReaction(emoji)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl transition-transform hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


