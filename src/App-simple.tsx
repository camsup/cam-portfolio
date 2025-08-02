import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import './App.css';

interface MusicTrack {
  title: string;
  artist: string;
  album: string;
  artwork: string;
  isNowPlaying: boolean;
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Generate a more sophisticated random start time
  const generateRandomStartTime = () => {
    // Try different video lengths to find the best random range
    const possibleLengths = [300, 600, 900, 1200]; // 5, 10, 15, 20 minutes
    const randomLength = possibleLengths[Math.floor(Math.random() * possibleLengths.length)];
    return Math.floor(Math.random() * randomLength);
  };
  
  const initialStartTime = generateRandomStartTime();
  
  // Refresh video with new random start time every 5 minutes
  useEffect(() => {
    const refreshVideo = () => {
      const newRandomTime = generateRandomStartTime();
      const iframe = document.querySelector('.background-video') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = `https://www.youtube.com/embed/Q1LpcdlOxRo?autoplay=1&mute=1&loop=1&playlist=Q1LpcdlOxRo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&start=${newRandomTime}`;
      }
    };

    const interval = setInterval(refreshVideo, 300000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 1000], [0, -100]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Generate clean colorful particles
  useEffect(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, []);

  // Fetch Last.fm data
  useEffect(() => {
    const fetchLastfmData = async () => {
      try {
        const apiKey = '2840907d76d8663a220f47b01f14a5b6';
        const username = 'Camsup';
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
        );
        const data = await response.json();
        
        if (data.recenttracks?.track?.[0]) {
          const track = data.recenttracks.track[0];
          setCurrentTrack({
            title: track.name,
            artist: track.artist['#text'],
            album: track.album['#text'],
            artwork: track.image[2]['#text'],
            isNowPlaying: track['@attr']?.nowplaying === 'true'
          });
        }
      } catch (error) {
        console.log('Last.fm data not available');
      }
    };

    fetchLastfmData();
    const interval = setInterval(fetchLastfmData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container" ref={containerRef}>
      {/* Video Background */}
      <div className="video-background">
        {!videoLoaded && <div className="video-loading" />}
        <iframe
          src={`https://www.youtube.com/embed/Q1LpcdlOxRo?autoplay=1&mute=1&loop=1&playlist=Q1LpcdlOxRo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&start=${initialStartTime}&fs=0&color=white&theme=dark&wmode=transparent`}
          title="Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
      
      {/* Clean Colorful Particles */}
      <div className="floating-particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              color: particle.color,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
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
            style={{ y: springY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.h1
              className="title"
              whileHover={{ 
                scale: 1.02,
                textShadow: "0 0 20px rgba(255,255,255,0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              CAM
            </motion.h1>
            
            {/* Last.fm Integration */}
            {currentTrack && (
              <motion.div
                className="music-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="track-info">
                  {currentTrack.artwork && (
                    <div className="artwork">
                      <img src={currentTrack.artwork} alt={currentTrack.album} />
                      {currentTrack.isNowPlaying && (
                        <div className="playing-indicator">
                          <div className="pulse-dot" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="track-details">
                    <div className="track-name">{currentTrack.title}</div>
                    <div className="track-artist">{currentTrack.artist}</div>
                    <div className="track-album">{currentTrack.album}</div>
                  </div>
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
