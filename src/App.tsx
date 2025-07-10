import './App.css';
import { useState, useEffect } from 'react';
import { photoGallery, photoCategories } from './photoData';

type SectionKey = 'home' | 'photos' | 'about';

function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle link card hover effects
  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty('--x', `${x}%`);
    card.style.setProperty('--y', `${y}%`);
  };

  const sections: Record<SectionKey, { title: string; subtitle: string; content: React.ReactElement }> = {
    home: {
      title: 'CAM',
      subtitle: 'CLEVELAND, OHIO',
      content: (
        <div className="links-grid">
          <a 
            href="https://instagram.com" 
            className="link-card" 
            data-platform="instagram"
            onMouseMove={handleCardMouseMove}
          >
            <div className="link-icon">📸</div>
            <div className="link-text">INSTAGRAM</div>
            <div className="link-arrow">→</div>
          </a>
          <a 
            href="https://twitter.com" 
            className="link-card" 
            data-platform="twitter"
            onMouseMove={handleCardMouseMove}
          >
            <div className="link-icon">🐦</div>
            <div className="link-text">TWITTER</div>
            <div className="link-arrow">→</div>
          </a>
          <a 
            href="https://github.com/camsup" 
            className="link-card" 
            data-platform="github"
            onMouseMove={handleCardMouseMove}
          >
            <div className="link-icon">💻</div>
            <div className="link-text">GITHUB</div>
            <div className="link-arrow">→</div>
          </a>
          <a 
            href="mailto:cameronrdickenson@gmail.com" 
            className="link-card" 
            data-platform="email"
            onMouseMove={handleCardMouseMove}
          >
            <div className="link-icon">✉️</div>
            <div className="link-text">EMAIL</div>
            <div className="link-arrow">→</div>
          </a>
          <a 
            href="https://linkedin.com" 
            className="link-card" 
            data-platform="linkedin"
            onMouseMove={handleCardMouseMove}
          >
            <div className="link-icon">💼</div>
            <div className="link-text">LINKEDIN</div>
            <div className="link-arrow">→</div>
          </a>
          <a 
            href="/portfolio.pdf" 
            className="link-card" 
            data-platform="portfolio"
            onMouseMove={handleCardMouseMove}
          >
            <div className="link-icon">📁</div>
            <div className="link-text">PORTFOLIO</div>
            <div className="link-arrow">→</div>
          </a>
        </div>
      )
    },
    photos: {
      title: 'PHOTOS',
      subtitle: 'MOMENTS & MEMORIES',
      content: (
        <div className="photos-grid">
          {photoGallery.map((photo) => (
            <div key={photo.id} className="photo-card">
              {photo.placeholder ? (
                <div className="photo-placeholder">
                  <span>{photoCategories[photo.category as keyof typeof photoCategories]}</span>
                  <p>{photo.category}</p>
                </div>
              ) : (
                <img 
                  src={photo.src} 
                  alt={photo.alt}
                  className="photo-image"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      )
    },
    about: {
      title: 'ABOUT',
      subtitle: 'CREATIVE HUMAN FROM CLEVELAND',
      content: (
        <div className="about-content">
          <div className="about-text">
            <p>Building digital experiences that matter, one pixel at a time.</p>
            <p>Currently exploring the intersection of design, technology, and human connection.</p>
            <p>Always down for a good conversation about creative work and life.</p>
          </div>
          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">CURIOSITY</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">CREATING</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">AUTHENTIC</span>
            </div>
          </div>
          <div className="about-skills">
            <div className="skill-tag">Design</div>
            <div className="skill-tag">Development</div>
            <div className="skill-tag">Photography</div>
            <div className="skill-tag">Coffee</div>
            <div className="skill-tag">Music</div>
            <div className="skill-tag">Travel</div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="top-nav">
        {(Object.keys(sections) as SectionKey[]).map((key) => (
          <button
            key={key}
            className={`nav-item ${activeSection === key ? 'active' : ''}`}
            onClick={() => setActiveSection(key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveSection(key);
              }
            }}
            aria-label={`Navigate to ${key} section`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <div className="section-header">
            <h1 className="section-title" data-text={sections[activeSection].title}>
              {sections[activeSection].title}
            </h1>
            <p className="section-subtitle">{sections[activeSection].subtitle}</p>
          </div>
          
          <div className={`section-content section-${activeSection}`}>
            {sections[activeSection].content}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div 
            className="float-1" 
            style={{ 
              transform: `translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.005}px)` 
            }}
          ></div>
          <div 
            className="float-2"
            style={{ 
              transform: `translate(${mousePosition.x * -0.003}px, ${mousePosition.y * -0.003}px)` 
            }}
          ></div>
          <div 
            className="float-3"
            style={{ 
              transform: `translate(${mousePosition.x * 0.004}px, ${mousePosition.y * 0.004}px)` 
            }}
          ></div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CAM</p>
      </footer>
    </div>
  );
}

export default App;
