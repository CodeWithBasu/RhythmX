"use client"

import React, { useState, useEffect, useRef } from "react"

import { motion } from "framer-motion"
import { Geist_Mono } from "next/font/google"
import { Upload, Database, Share2, Users } from "lucide-react"
import Link from "next/link"
import ElasticSlider from "@/components/ui/elastic-slider"
import TextType from "@/components/ui/TextType"
import { useDevice } from "@/hooks/use-device"
import { getPusherClient } from "@/lib/pusher-client"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
})

const DEFAULT_TEXT = [
  "LOST IN THE NEON LIGHTS",
  "FEEL THE RHYTHM IN YOUR MIND",
  "ECHOES OF A CYBER CITY",
  "WE ARE INFINITE"
];

export default function Component() {
  const device = useDevice()
  // Increased bar counts to make the visualizer span wider on all devices
  const activeBars = device === 'mobile' ? 56 : device === 'tablet' ? 64 : 80;
  
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
  const [newSongMeta, setNewSongMeta] = useState({ title: '', url: '', language: 'English' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const [partyId, setPartyId] = useState<string | null>(null)
  const [isHost, setIsHost] = useState(false)
  const [currentSongObj, setCurrentSongObj] = useState<any>(null)
  const [hasJoinedMobile, setHasJoinedMobile] = useState(false)

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
        const res = await fetch(`/api/party?id=${partyId}`);
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

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [partyId, isHost, hasJoinedMobile]);

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
        songUrl = `/api/songs/${data.song.id}/stream`;
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
       
       // Tighter strict jump without playbackRate artifacts
       if (Math.abs(drift) > 0.2) {
          audioRef.current.currentTime = expectedTime;
       }
       
       // Sync state
       if (data.isPlaying && audioRef.current.paused) {
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
        await fetch('/api/party', {
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
      const res = await fetch('/api/party', {
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

  // Listen for track changes to refetch lyrics
  useEffect(() => {
    if (currentTrack && currentTrack !== "~/ 2 Million") {
      fetchSyncedLyrics(currentTrack)
    }
  }, [currentTrack])

  const handleMouseMove = (e: React.MouseEvent) => {
    // Normalize mouse position between -1 and 1
    const x = (e.clientX / window.innerWidth) * 2 - 1
    const y = (e.clientY / window.innerHeight) * 2 - 1
    setMousePos({ x, y })
  }

  const fetchSongs = () => {
    fetch('/api/songs')
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
        
        // Connect: source -> analyser -> destination
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
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

      const final = Math.max(0, Math.min(1.2, normalized)) // Era 2.0, ahora 1.2 (40% menos)
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
        songUrl = `/api/songs/${song.id}/stream`
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
    <div 
      className={`min-h-screen bg-transparent flex flex-col items-center justify-center p-4 sm:p-8 overflow-x-hidden ${geistMono.className}`}
      onMouseMove={handleMouseMove}
    >


      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />

      {/* Audio element */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        onLoadedData={() => {
            console.log("Audio loaded")
            setIsBuffering(false)
        }}
        onPlay={() => {
          console.log("Audio started playing")
          setIsPlaying(true)
        }}
        onPause={() => {
          console.log("Audio paused")
          setIsPlaying(false)
        }}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const time = audioRef.current.currentTime
            setCurrentTime(time)
            
            // Sync Lyrics engine
            if (lyrics.length > 0) {
              // Find the last lyric line that is past its timestamp
              let activeIndex = -1
              for (let i = 0; i < lyrics.length; i++) {
                if (time >= lyrics[i].time) {
                  activeIndex = i
                } else {
                  break // Since array is sorted by time, we can break early
                }
              }
              if (activeIndex !== currentLyricIndex) {
                setCurrentLyricIndex(activeIndex)
              }
            }
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration)
        }}
      />

      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex flex-wrap justify-end gap-2 sm:gap-3 z-10 w-full max-w-[calc(100%-80px)] sm:max-w-none">
        
        <motion.button
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 ${partyId ? (isHost ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' : 'bg-blue-500/20 text-blue-300 border-blue-500/40') : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10'} rounded-lg border transition-all duration-200`}
          onClick={startParty}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {partyId ? <Users size={14} className="sm:w-4 sm:h-4" /> : <Share2 size={14} className="sm:w-4 sm:h-4" />}
          <span className="text-[10px] sm:text-sm hidden sm:inline">{partyId ? (isHost ? "Hosting Party" : "In Party") : "Start Party"}</span>
          <span className="text-[10px] sm:hidden">{partyId ? "Party" : "Share"}</span>
        </motion.button>

        <Link href="/admin">
          <motion.div
            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Database size={14} className="sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-sm">Admin</span>
          </motion.div>
        </Link>

        <motion.button
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg border border-white/10 transition-all duration-200"
          onClick={() => setIsAddingSong(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-[10px] sm:text-sm">+ Library</span>
        </motion.button>

        <motion.button
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white rounded-lg border border-white/20 hover:border-white/40 transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={14} className="sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-sm hidden sm:inline">Upload MP3</span>
          <span className="text-[10px] sm:hidden">Upload</span>
        </motion.button>
      </div>


      {/* Add Song Modal */}
      {isAddingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <h2 className="text-xl font-bold text-white mb-6">Add Song to Library</h2>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault()
                
                if (selectedFile) {
                  if (selectedFile.size > 4 * 1024 * 1024) {
                    alert("Error: File is too large. Vercel limits uploads to 4.5MB. Please use a smaller MP3 or a direct URL.")
                    return
                  }

                  setIsBuffering(true) // Use buffering state as loading
                  const audio = new Audio()
                  const url = URL.createObjectURL(selectedFile)
                  audio.src = url
                  audio.onloadedmetadata = () => {
                    const duration = Math.floor(audio.duration)
                    URL.revokeObjectURL(url)
                    
                    const reader = new FileReader()
                    reader.readAsDataURL(selectedFile)
                    reader.onload = async () => {
                      try {
                        const songData = {
                          ...newSongMeta,
                          url: reader.result as string,
                          duration: duration
                        }
                        
                        const response = await fetch('/api/songs', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(songData),
                        })

                        setIsBuffering(false)
                        if (response.ok) {
                          setIsAddingSong(false)
                          setSelectedFile(null)
                          setNewSongMeta({ title: '', url: '', language: 'English' })
                          fetchSongs()
                        } else {
                          const data = await response.json()
                          alert(`Error: ${data.error || 'Failed to save song.'}`)
                        }
                      } catch (err) {
                        setIsBuffering(false)
                        alert("Network error: Could not connect to the server.")
                      }
                    }
                  }
                  audio.onerror = () => {
                    setIsBuffering(false)
                    alert("Failed to read audio file duration. The file might be corrupted.")
                  }
                } else {
                  try {
                    const response = await fetch('/api/songs', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newSongMeta),
                    })
                    if (response.ok) {
                      setIsAddingSong(false)
                      fetchSongs()
                    } else {
                      const data = await response.json()
                      alert(`Error: ${data.error || 'Failed to save song.'}`)
                    }
                  } catch (err) {
                    alert("Network error: Could not connect to the server.")
                  }
                }
              }} 
              className="space-y-4"
              onDragEnter={handleDrag}
            >
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive ? "border-white bg-white/5" : "border-white/10 bg-white/0"
                } ${selectedFile ? "border-green-500/50 bg-green-500/5" : ""}`}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="text-green-500 font-medium">✓ {selectedFile.name}</div>
                    <button type="button" onClick={() => setSelectedFile(null)} className="text-xs text-white/40 hover:text-white underline">Change File</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-white/60">Drag and drop an MP3 here</div>
                    <div className="text-xs text-white/30 uppercase tracking-widest">or</div>
                    <label className="text-sm border border-white/20 px-3 py-1 rounded hover:bg-white/5 text-white/80 transition-colors cursor-pointer inline-block">
                      Select File
                      <input 
                        type="file" 
                        accept="audio/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && file.type.startsWith('audio/')) {
                            setSelectedFile(file)
                            setNewSongMeta({
                              ...newSongMeta,
                              title: file.name.replace(/\.[^/.]+$/, "")
                            })
                          }
                          // Reset input value so the same file can be selected again if needed
                          e.target.value = ''
                        }} 
                      />
                    </label>
                  </div>
                )}
              </div>

              {dragActive && (
                <div 
                  className="fixed inset-0 z-10" 
                  onDragEnter={handleDrag} 
                  onDragLeave={handleDrag} 
                  onDragOver={handleDrag} 
                  onDrop={handleDrop}
                />
              )}

              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Song Title</label>
                <input 
                  required
                  type="text" 
                  value={newSongMeta.title}
                  onChange={(e) => setNewSongMeta({...newSongMeta, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30"
                  placeholder="e.g. Starboy (The Weeknd)"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Language / Genre</label>
                <select
                  value={newSongMeta.language}
                  onChange={(e) => setNewSongMeta({...newSongMeta, language: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Odia">Odia</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Instrumental">Instrumental</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {!selectedFile && (
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Or Use Direct MP3 URL</label>
                  <input 
                    type="url" 
                    value={newSongMeta.url}
                    onChange={(e) => setNewSongMeta({...newSongMeta, url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30"
                    placeholder="https://example.com/song.mp3"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsAddingSong(false)}
                  className="flex-1 py-3 text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newSongMeta.title || (!newSongMeta.url && !selectedFile) || isBuffering}
                  className="flex-1 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors"
                >
                  {isBuffering ? "Processing..." : "Save to Library"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Debug info */}
      <div className="absolute top-8 left-8 text-white/40 text-xs">
        <div>Audio: {hasAudio ? "✓" : "✗"}</div>
        <div>Initialized: {isInitialized ? "✓" : "✗"}</div>
        <div>Playing: {isPlaying ? "✓" : "✗"}</div>
        <div>Loop: {isLooping ? "✓" : "✗"}</div>
        <div>{isBuffering ? "BUFF..." : ""}</div>
      </div>

      {/* Audio Visualizer - EFECTO OLA */}
      <div className={`flex items-end justify-center gap-[2px] sm:gap-1 mb-8 sm:mb-16 w-full max-w-6xl px-1 sm:px-4 overflow-hidden ${device === 'mobile' ? 'h-40' : device === 'tablet' ? 'h-60' : 'h-80'}`}>
        {audioData.slice(0, activeBars).map((height, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-t-sm"
            style={{
              width: device === 'mobile' ? '5px' : device === 'tablet' ? '6px' : '8px',
              opacity: height > 0 ? 1 : 0,
            }}
            initial={{ scaleX: 0 }}
            animate={{
              height: `${height * 150}px`,
              opacity: height > 0 ? 1 : 0,
              scaleX: showInitialAnimation ? 1 : 1,
            }}
            transition={{
              height: {
                type: "spring",
                stiffness: height > 0 ? 400 : 200,
                damping: height > 0 ? 25 : 35,
                mass: 0.2,
              },
              opacity: {
                duration: height > 0 ? 0.1 : 0.8,
                ease: "easeOut",
              },
              scaleX: {
                duration: 2,
                delay: Math.abs(index - 40) * 0.015,
                ease: "easeOut",
              },
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 text-white">
        <motion.div
          onClick={togglePlayback}
          className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isBuffering ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <motion.path
                d={isPlaying ? "M6 4h4v16H6V4zm8 0h4v16h-4V4z" : "M8 5v14l11-7z"}
                fill="currentColor"
                animate={{
                    d: isPlaying ? "M6 4h4v16H6V4zm8 0h4v16h-4V4z" : "M8 5v14l11-7z",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                />
            </svg>
          )}
        </motion.div>

        <motion.div
          className="text-2xl font-light tracking-wider"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {currentTrack}
        </motion.div>
      </div>

      {/* Seek Bar */}
      <div className="w-full max-w-2xl mt-12 mb-4">
        <div className="flex justify-between w-full px-2 text-xs font-medium text-white/40 mb-2">
          <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
          <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
        </div>
        <ElasticSlider
          value={currentTime}
          maxValue={duration || 100}
          startingValue={0}
          onChange={(val: number) => setCurrentTime(val)}
          onDragEnd={(val: number) => {
            if (audioRef.current) audioRef.current.currentTime = val
          }}
          leftIcon={null}
          rightIcon={null}
          className="w-full"
        />

        {/* Manual Sync Offset Calibration for Guests */}
        {partyId && !isHost && (
          <div className="flex flex-col items-center gap-1 sm:gap-2 mt-4 sm:mt-6 max-w-xs mx-auto opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-white/40 text-[10px] font-mono tracking-widest uppercase">Sync Adjustment: {(syncOffset > 0 ? "+" : "") + (syncOffset * 1000).toFixed(0)} ms</span>
              <input 
                type="range" 
                min="-0.5" 
                max="0.5" 
                step="0.01" 
                value={syncOffset}
                onChange={(e) => setSyncOffset(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer" 
              />
              <span className="text-white/30 text-[8px]">Slide to fix echo/hardware lag</span>
          </div>
        )}
      </div>

      {/* Playlist */}
      <div className="mt-8 w-full max-w-2xl bg-white/5 rounded-xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5 font-semibold text-white/80 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span>Playlist</span>
            <span className="text-[10px] text-white/20 uppercase tracking-[2px]">On-Demand Cloud Library</span>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by song name or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111]/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
        <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
          {songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.language?.toLowerCase().includes(searchQuery.toLowerCase())).map((song) => (
            <div 
              key={song.id} 
              onClick={() => playSong(song)}
              className="p-3 text-white/60 hover:text-white hover:bg-white/10 cursor-pointer transition-colors group flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-white transition-colors" />
                <div>
                    <span className="font-medium mr-2">{song.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">{song.language}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs opacity-50">
                    {Math.floor(song.duration / 60)}:{(Math.floor(song.duration % 60)).toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          ))}
          {songs.length > 0 && songs.filter((song) => song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.language?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="p-6 text-center">
                <div className="text-white/40 text-sm">No songs found matching "{searchQuery}"</div>
            </div>
          )}
          {songs.length === 0 && !error && (
            <div className="p-6 text-center">
                <div className="text-white/20 text-sm italic">Library is empty.</div>
                <div className="text-white/10 text-[10px] mt-1">Add music using the buttons above.</div>
            </div>
          )}
          {error && (
            <div className="p-4 text-center text-sm text-red-400 bg-red-400/10">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 mb-8 flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/50 tracking-[0.2em] font-light uppercase">
          <span className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} RhythmX
          </span>
          <span className="w-1 h-1 rounded-full bg-purple-500/50"></span>
          <span className="flex items-center gap-1.5">
            Designed with <span className="text-red-500/80 animate-pulse text-xs">❤️</span> by <span className="text-white/90 font-medium tracking-widest text-[#a855f7] mix-blend-screen">Basudev</span> ☕
          </span>
        </div>
      </div>

      {/* Join Party Overlay */}
      {partyId && !isHost && !hasJoinedMobile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Users className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You've been invited!</h2>
            <p className="text-white/60 mb-8 text-sm">Join the live listening session to synchronize playback.</p>
            <button 
              onClick={async () => {
                await initializeAudioContext();
                setHasJoinedMobile(true);
              }}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Join Party
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
