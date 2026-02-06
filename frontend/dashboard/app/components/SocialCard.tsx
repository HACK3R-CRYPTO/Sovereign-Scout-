'use client'

import { useEffect, useState } from 'react'

interface SocialPost {
  id: string
  timestamp: string
  text: string
  type: 'buy' | 'sell' | 'info'
}

export default function SocialCard() {
  const [posts, setPosts] = useState<SocialPost[]>([])

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/social')
        const json = await res.json()
        if (json.success) {
          setPosts(json.data.posts || [])
        }
      } catch (error) {
        console.error('Failed to fetch social feed:', error)
      }
    }

    fetchSocial()
    const interval = setInterval(fetchSocial, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400'
      case 'sell': return 'text-orange-400'
      default: return 'text-blue-400'
    }
  }

  return (
    <div className="backdrop-blur-md bg-gray-900/50 rounded-xl border border-purple-500/30 p-6 shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
        📢 Social Feed
        <span className="text-xs text-gray-400 font-normal">(Twitter-Style)</span>
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No posts yet
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    post.type === 'buy' ? 'bg-green-400' : 
                    post.type === 'sell' ? 'bg-orange-400' : 
                    'bg-blue-400'
                  }`} />
                  <span className={`text-sm font-semibold ${getTypeColor(post.type)}`}>
                    Sovereign Scout
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>
              
              <p className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                {post.text}
              </p>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  )
}
