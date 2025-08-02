import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import './App.css';

// Mobile detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
};

interface MusicTrack {
  title: string;
  artist: string;
  album: string;
  artwork: string;
  isNowPlaying: boolean;
  timestamp?: string;
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState('');
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [recentTracks, setRecentTracks] = useState<MusicTrack[]>([]);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string, size: number, speed: number, type: string}>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const { scrollY } = useScroll();
  
  // Pick a random start time when the page loads
  const [videoStartTime] = useState(() => {
    // Video is about 20 minutes long (1200 seconds), so pick a random point between 30s and 1100s
    return Math.floor(Math.random() * 1070) + 30;
  });
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 1000], [0, -100]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Generate enhanced colorful particles with more variety
  useEffect(() => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', 
      '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24',
      '#ff3838', '#ff6348', '#ffa502', '#2ed573', '#1e90ff', '#ff4757'
    ];
    
    const particleTypes = ['glow', 'sparkle', 'pulse', 'float'];
    
    // Reduce particles on mobile for better performance
    const particleCount = isMobile() ? 15 : 25;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: isMobile() ? Math.random() * 2 + 1.5 : Math.random() * 3 + 2, // Smaller on mobile
      speed: isMobile() ? Math.random() * 2 + 1.5 : Math.random() * 3 + 2, // Slower on mobile
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
    }));
    setParticles(newParticles);
  }, []);

  // Fetch Last.fm data with improved error handling
  useEffect(() => {
    const fetchLastfmData = async () => {
      try {
        const apiKey = import.meta.env.VITE_LASTFM_API_KEY || '2840907d76d8663a220f47b01f14a5b6';
        const username = import.meta.env.VITE_LASTFM_USERNAME || 'camsup';
        
        if (!apiKey) {
          console.log('❌ Last.fm API key not configured - check your .env file');
          return;
        }
        
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=10`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Last.fm API Error ${data.error}: ${data.message}`);
        }
        
        if (data.recenttracks?.track) {
          const tracks = data.recenttracks.track.map((track: any) => ({
            title: track.name,
            artist: track.artist['#text'],
            album: track.album['#text'],
            artwork: track.image[2]['#text'],
            isNowPlaying: track['@attr']?.nowplaying === 'true',
            timestamp: track.date?.['#text']
          }));
          
          setCurrentTrack(tracks[0]);
          setRecentTracks(tracks.slice(1, 6));
        }
      } catch (error) {
        console.error('❌ Last.fm error:', error);
      }
    };

    fetchLastfmData();
    const interval = setInterval(fetchLastfmData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load animation with loading quotes
  useEffect(() => {
    const musicQuotes = [
      "Music is the universal language of mankind.",
      "Where words fail, music speaks.",
      "Music is life itself.",
      "One good thing about music, when it hits you, you feel no pain.",
      "Music is the soundtrack of your life.",
      "Without music, life would be a mistake.",
      "Music is the divine way to tell beautiful, poetic things to the heart.",
      "Music is the art of thinking with sounds.",
      "Music is the poetry of the air.",
      "Music is the strongest form of magic."
    ];
    
    let quoteIndex = 0;
    const quoteInterval = setInterval(() => {
      setLoadingQuote(musicQuotes[quoteIndex]);
      quoteIndex = (quoteIndex + 1) % musicQuotes.length;
    }, 2000);
    
    const timer = setTimeout(() => setIsLoaded(true), 800);
    
    return () => {
      clearTimeout(timer);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="app-container" ref={containerRef}>
      {/* Video Background */}
      <div className="video-background">
        {!videoLoaded && (
          <div className="video-loading">
            <div className="loading-content">
              <div className="loading-particles">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="loading-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  />
                ))}
              </div>
              <motion.div
                className="loading-quote"
                key={loadingQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                "{loadingQuote}"
              </motion.div>
            </div>
          </div>
        )}
        <iframe
          ref={videoRef}
          src={`https://www.youtube.com/embed/Q1LpcdlOxRo?autoplay=1&mute=1&loop=1&playlist=Q1LpcdlOxRo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&start=${videoStartTime}&fs=0&color=white&theme=dark&wmode=transparent&origin=${window.location.origin}&vq=hd1080&autohide=1&modestbranding=1&showinfo=0`}
          title="Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={`background-video ${videoLoaded ? 'loaded' : ''}`}
          onLoad={() => {
            setVideoLoaded(true);
            // Additional delay to ensure video is fully loaded
            setTimeout(() => setVideoLoaded(true), 1000);
          }}
          onError={(e) => console.log('Video failed to load:', e)}
        />
        <div className="video-overlay" />
      </div>
      
      <div className="background-grid" />
      
      {/* Enhanced Colorful Particles */}
      <div className="floating-particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`particle particle-${particle.type}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              color: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.9, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: particle.speed + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="main-content"
            style={{ y: isMobile() ? 0 : springY }}
            initial={{ opacity: 0, scale: 0.95, y: isMobile() ? 20 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h1
              className="title"
              whileHover={{ 
                scale: isMobile() ? 1.02 : 1.05,
                textShadow: "0 0 30px rgba(255,255,255,0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="title-letter" style={{ animationDelay: '0.1s' }}>C</span>
              <span className="title-letter" style={{ animationDelay: '0.2s' }}>A</span>
              <span className="title-letter" style={{ animationDelay: '0.3s' }}>M</span>
            </motion.h1>
            
            {/* Last.fm Integration */}
            {currentTrack ? (
              <motion.div
                className="music-widget"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: isMobile() ? 1.02 : 1.05,
                  y: isMobile() ? 0 : -5
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="track-info">
                  {currentTrack.artwork && (
                    <div className="artwork">
                      <img src={currentTrack.artwork} alt={currentTrack.album} />
                    </div>
                  )}
                  <div className="track-details">
                    <div className="track-name">{currentTrack.title}</div>
                    <div className="track-artist">{currentTrack.artist}</div>
                    <div className="track-album">{currentTrack.album}</div>
                    {currentTrack.isNowPlaying && (
                      <div className="playing-indicator">
                        <div className="now-playing-badge">
                          <span className="now-playing-text">NOW PLAYING</span>
                          <div className="now-playing-bars">
                            <div className="bar bar1"></div>
                            <div className="bar bar2"></div>
                            <div className="bar bar3"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="music-widget"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.6, 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: isMobile() ? 1.02 : 1.05,
                  y: isMobile() ? 0 : -5
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="track-info">
                  <div className="artwork">
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: 'rgba(255,255,255,0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      🎵
                    </div>
                  </div>
                  <div className="track-details">
                    <div className="track-name">Last.fm Not Connected</div>
                    <div className="track-artist">Add your API key to .env</div>
                    <div className="track-album">Check setup-lastfm.md</div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Recent Tracks Flowing List */}
            {recentTracks.length > 0 && (
              <motion.div
                className="recent-tracks-flowing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <div className="recent-tracks-label">Recently Played</div>
                <div className="recent-tracks-flow">
                  {recentTracks.map((track, index) => (
                    <motion.div
                      key={`${track.title}-${track.artist}-${index}`}
                      className="recent-track-flow-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.9 + (index * 0.15), 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -2
                      }}
                    >
                      <div className="recent-track-flow-artwork">
                        {track.artwork ? (
                          <img src={track.artwork} alt={track.album} />
                        ) : (
                          <div className="recent-track-flow-placeholder">🎵</div>
                        )}
                      </div>
                      <div className="recent-track-flow-info">
                        <div className="recent-track-flow-name">{track.title}</div>
                        <div className="recent-track-flow-artist">{track.artist}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
