import './App.css';
// Removed unused hooks

function App() {

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="top-nav">
        <button className="nav-item active">HOME</button>
        <button className="nav-item">PHOTOS</button>
        <button className="nav-item">ABOUT</button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <div className="section-header">
            <h1 className="section-title">CAM</h1>
            <p className="section-subtitle">CLEVELAND, OHIO</p>
          </div>
          
          <div className="section-content">
            <div className="links-grid">
              <a href="https://instagram.com" className="link-card">
                <div className="link-icon">📸</div>
                <div className="link-text">INSTAGRAM</div>
                <div className="link-arrow">→</div>
              </a>
              <a href="https://github.com/camsup" className="link-card">
                <div className="link-icon">💻</div>
                <div className="link-text">GITHUB</div>
                <div className="link-arrow">→</div>
              </a>
            </div>
          </div>
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
