// YouTube Background Video JavaScript

class YouTubeBackground {
    constructor(options = {}) {
        this.videoId = options.videoId || 'Q1LpcdlOxRo';
        this.container = options.container || '.youtube-background';
        this.origin = options.origin || window.location.origin;
        this.onLoad = options.onLoad || null;
        this.onError = options.onError || null;
        
        this.init();
    }

    init() {
        this.createIframe();
        this.setupEventListeners();
        this.setupSecurityMeasures();
    }

    createIframe() {
        const container = document.querySelector(this.container);
        if (!container) {
            console.error('YouTube background container not found');
            return;
        }

        // Create loading spinner
        const loading = document.createElement('div');
        loading.className = 'video-loading';
        loading.id = 'videoLoading';
        container.appendChild(loading);

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'youtubeVideo';
        iframe.src = this.buildVideoUrl();
        iframe.title = 'Background Video';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullScreen = true;
        iframe.onload = () => this.videoLoaded();
        iframe.onerror = () => this.videoError();

        container.appendChild(iframe);

        // Set timeout for loading
        setTimeout(() => {
            if (loading.style.display !== 'none') {
                this.videoError();
            }
        }, 10000);
    }

    buildVideoUrl() {
        const params = new URLSearchParams({
            autoplay: '1',
            mute: '1',
            loop: '1',
            playlist: this.videoId,
            controls: '0',
            showinfo: '0',
            rel: '0',
            modestbranding: '1',
            playsinline: '1',
            enablejsapi: '1',
            iv_load_policy: '3',
            disablekb: '1',
            fs: '0',
            color: 'white',
            theme: 'dark',
            wmode: 'transparent',
            origin: this.origin
        });

        return `https://www.youtube.com/embed/${this.videoId}?${params.toString()}`;
    }

    videoLoaded() {
        const video = document.getElementById('youtubeVideo');
        const loading = document.getElementById('videoLoading');
        
        // Hide loading spinner
        if (loading) {
            loading.style.display = 'none';
        }
        
        // Show video with fade-in effect
        if (video) {
            setTimeout(() => {
                video.classList.add('loaded');
            }, 500);
        }

        // Call onLoad callback
        if (this.onLoad && typeof this.onLoad === 'function') {
            this.onLoad();
        }
    }

    videoError() {
        const fallback = document.getElementById('fallbackMessage');
        const loading = document.getElementById('videoLoading');
        
        if (loading) {
            loading.style.display = 'none';
        }
        
        if (fallback) {
            fallback.classList.add('show');
        }

        // Call onError callback
        if (this.onError && typeof this.onError === 'function') {
            this.onError();
        }
    }

    setupEventListeners() {
        // Disable right-click on video
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest(this.container)) {
                e.preventDefault();
                return false;
            }
        });

        // Prevent video interaction
        document.addEventListener('click', (e) => {
            if (e.target.closest(this.container)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });

        // Handle visibility change to ensure video continues playing
        document.addEventListener('visibilitychange', () => {
            const video = document.getElementById('youtubeVideo');
            if (video && !document.hidden) {
                // Refresh video source to ensure it continues playing
                const currentSrc = video.src;
                video.src = currentSrc;
            }
        });

        // Ensure video is muted and autoplays on window load
        window.addEventListener('load', () => {
            const video = document.getElementById('youtubeVideo');
            if (video) {
                video.setAttribute('muted', 'true');
                video.setAttribute('autoplay', 'true');
            }
        });
    }

    setupSecurityMeasures() {
        // Disable text selection on video container
        const container = document.querySelector(this.container);
        if (container) {
            container.style.userSelect = 'none';
            container.style.webkitUserSelect = 'none';
            container.style.mozUserSelect = 'none';
            container.style.msUserSelect = 'none';
        }
    }

    // Public method to refresh video
    refresh() {
        const video = document.getElementById('youtubeVideo');
        if (video) {
            video.src = this.buildVideoUrl();
        }
    }

    // Public method to change video
    changeVideo(videoId) {
        this.videoId = videoId;
        this.refresh();
    }
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.youtube-background')) {
        new YouTubeBackground({
            videoId: 'Q1LpcdlOxRo',
            onLoad: () => console.log('YouTube background loaded successfully'),
            onError: () => console.log('YouTube background failed to load')
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubeBackground;
} 