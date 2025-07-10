import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Music, Youtube, Briefcase, Mail, ExternalLink, ArrowUpRight } from 'lucide-react';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="loading-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="loading-content"
        >
          <h1 className="loading-title">CAM</h1>
          <p className="loading-subtitle">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-content">
          <div className="nav-logo">
            <span className="logo-text">CAM</span>
          </div>
          <div className="nav-links">
            <a href="#work" className="nav-link">Work</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h1 className="hero-title">
              <span className="hero-line">Creative</span>
              <span className="hero-line">Director</span>
              <span className="hero-line accent">& Visual Artist</span>
            </h1>
            <p className="hero-description">
              Crafting extraordinary digital experiences that push the boundaries of creativity and innovation.
            </p>
            
            <div className="hero-actions">
              <motion.button 
                className="hero-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Work
                <ArrowUpRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="connect">
        <div className="connect-content">
          <h2 className="connect-title">Let's Connect</h2>
          <p className="connect-description">Find me across the digital landscape</p>
          
          <div className="social-grid">
            <motion.a
              href="https://instagram.com/cam.creative"
              className="social-card bg-gradient-to-r from-pink-500 to-orange-500"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="social-icon">
                <Instagram size={20} />
              </div>
              <div className="social-content">
                <h3 className="social-title">Instagram</h3>
                <p className="social-description">Visual storytelling</p>
              </div>
              <div className="social-arrow">
                <ExternalLink size={16} />
              </div>
            </motion.a>

            <motion.a
              href="https://twitter.com/cam_creative"
              className="social-card bg-gradient-to-r from-blue-400 to-blue-600"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="social-icon">
                <Twitter size={20} />
              </div>
              <div className="social-content">
                <h3 className="social-title">Twitter</h3>
                <p className="social-description">Creative thoughts</p>
              </div>
              <div className="social-arrow">
                <ExternalLink size={16} />
              </div>
            </motion.a>

            <motion.a
              href="https://tiktok.com/@cam.creative"
              className="social-card bg-gradient-to-r from-purple-400 to-pink-600"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="social-icon">
                <Music size={20} />
              </div>
              <div className="social-content">
                <h3 className="social-title">TikTok</h3>
                <p className="social-description">Quick inspiration</p>
              </div>
              <div className="social-arrow">
                <ExternalLink size={16} />
              </div>
            </motion.a>

            <motion.a
              href="https://youtube.com/cam"
              className="social-card bg-gradient-to-r from-red-500 to-red-700"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="social-icon">
                <Youtube size={20} />
              </div>
              <div className="social-content">
                <h3 className="social-title">YouTube</h3>
                <p className="social-description">Tutorials & insights</p>
              </div>
              <div className="social-arrow">
                <ExternalLink size={16} />
              </div>
            </motion.a>

            <motion.a
              href="#work"
              className="social-card bg-gradient-to-r from-green-400 to-blue-500"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="social-icon">
                <Briefcase size={20} />
              </div>
              <div className="social-content">
                <h3 className="social-title">Portfolio</h3>
                <p className="social-description">Full case studies</p>
              </div>
              <div className="social-arrow">
                <ExternalLink size={16} />
              </div>
            </motion.a>

            <motion.a
              href="mailto:hello@cam.com"
              className="social-card bg-gradient-to-r from-yellow-400 to-orange-500"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="social-icon">
                <Mail size={20} />
              </div>
              <div className="social-content">
                <h3 className="social-title">Contact</h3>
                <p className="social-description">Let's collaborate</p>
              </div>
              <div className="social-arrow">
                <ExternalLink size={16} />
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h3>CAM</h3>
              <p>Creative Director & Visual Artist</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CAM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
