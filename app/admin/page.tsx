"use client"

import { useState, useEffect } from "react"
import { Trash2, Link as LinkIcon, Clock, Home, RefreshCw, Database } from "lucide-react"
import Link from "next/link"

interface Song {
  id: string
  title: string
  language: string
  duration: number
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)
    setAuthError("")
    
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      if (res.ok) {
        setIsAuthenticated(true)
        fetchSongs() // Load songs once authenticated
      } else {
        setAuthError("Invalid password. Please try again.")
        setPassword("")
      }
    } catch (err) {
      setAuthError("Network error. Please try again.")
    } finally {
      setIsAuthenticating(false)
    }
  }

  const fetchSongs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/songs')
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setSongs(data)
      setError(null)
    } catch (err) {
      setError("Failed to load songs from database.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) return
    
    setDeletingId(id)
    try {
      const res = await fetch(`/api/songs?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSongs(songs.filter(s => s.id !== id))
      } else {
        const data = await res.json()
        alert(`Failed to delete: ${data.error}`)
      }
    } catch (err) {
      alert("Network error while deleting.")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDuration = (seconds: number) => {
    // Check if valid number
    if (isNaN(seconds) || seconds === null) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono">
        <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-4">
              <Database className="text-white/80" size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-white/40 text-sm mt-2">Enter the master password to access your cloud library</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating || !password}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              {isAuthenticating ? <RefreshCw size={18} className="animate-spin" /> : "Authenticate"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors flex items-center justify-center gap-2">
              <Home size={14} />
              Return to RhythmX
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <Database className="text-white/60" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                Cloud Library Admin
              </h1>
              <p className="text-white/40 text-sm">Manage entries in your MongoDB Atlas database</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={fetchSongs} 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors border border-white/10"
            >
              <RefreshCw size={16} className={loading && !songs.length ? "animate-spin" : ""} />
              Refresh Data
            </button>
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg transition-colors font-medium"
            >
              <Home size={16} />
              Return to App
            </Link>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <div className="bg-[#111] border border-white/10 rounded-xl flex flex-col shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h2 className="font-semibold text-white/80">All Songs ({songs.length})</h2>
            <div className="text-xs text-white/30 uppercase tracking-widest">Live from MongoDB</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/40 text-xs tracking-wider uppercase">
                  <th className="p-4 font-normal">Track Information</th>
                  <th className="p-4 font-normal hidden sm:table-cell">Language</th>
                  <th className="p-4 font-normal w-24">Length</th>
                  <th className="p-4 font-normal w-32 hidden md:table-cell">Added On</th>
                  <th className="p-4 font-normal w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading && songs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-white/40 flex flex-col items-center gap-4 border-b-0">
                      <RefreshCw size={24} className="animate-spin text-white/20" />
                      Loading database records...
                    </td>
                  </tr>
                ) : songs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-white/40 border-b-0">
                      No songs found in the database. Add some from the main app!
                    </td>
                  </tr>
                ) : (
                  songs.map(song => (
                    <tr key={song.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="p-4">
                        <div className="font-medium text-white/90 truncate max-w-[200px] sm:max-w-xs">{song.title}</div>
                        <div className="text-[10px] text-white/30 font-mono truncate max-w-[200px] sm:max-w-xs mt-1.5 flex items-center gap-1.5">
                          <LinkIcon size={10} />
                          {song.id}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">
                          {song.language}
                        </span>
                      </td>
                      <td className="p-4 text-white/50 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="opacity-40" />
                          {formatDuration(song.duration)}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-white/40 hidden md:table-cell">
                        {song.createdAt ? new Date(song.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        }) : 'Unknown'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(song.id, song.title)}
                          disabled={deletingId === song.id}
                          className="p-2.5 inline-flex items-center justify-center text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50 border border-transparent hover:border-red-400/20"
                          title={`Delete "${song.title}"`}
                        >
                          {deletingId === song.id ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
