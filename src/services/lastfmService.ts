// Last.fm API Service with improved error handling

interface LastfmTrack {
  name: string;
  artist: { '#text': string };
  album: { '#text': string };
  image: Array<{ '#text': string }>;
  '@attr'?: { nowplaying: string };
  date?: { '#text': string };
}

interface LastfmResponse {
  recenttracks?: {
    track: LastfmTrack[];
  };
  error?: number;
  message?: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  album: string;
  artwork: string;
  isNowPlaying: boolean;
  lastPlayed?: string;
}

class LastfmService {
  private apiKey: string;
  private username: string;
  private baseUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor() {
    this.apiKey = import.meta.env.VITE_LASTFM_API_KEY || '';
    this.username = import.meta.env.VITE_LASTFM_USERNAME || 'Camsup';
  }

  private log(message: string, data?: any) {
    if (import.meta.env.DEV) {
      console.log(`[Last.fm] ${message}`, data || '');
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('method', endpoint);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('user', this.username);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    this.log(`Making request to: ${endpoint}`, { params });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CAM-Portfolio/1.0'
        }
      });

      this.log(`Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: LastfmResponse = await response.json();
      
      if (data.error) {
        throw new Error(`Last.fm API Error ${data.error}: ${data.message}`);
      }

      return data;
    } catch (error) {
      this.log(`Request failed:`, error);
      throw error;
    }
  }

  async getRecentTracks(limit: number = 1): Promise<MusicTrack | null> {
    try {
      if (!this.apiKey) {
        this.log('No API key configured');
        return null;
      }

      if (!this.username) {
        this.log('No username configured');
        return null;
      }

      this.log(`Fetching recent tracks for user: ${this.username}`);

      const data = await this.makeRequest('user.getrecenttracks', {
        limit: limit.toString()
      });

      if (!data.recenttracks?.track?.length) {
        this.log('No tracks found in response');
        return null;
      }

      const track = data.recenttracks.track[0];
      this.log('Track data received:', track);

      const musicTrack: MusicTrack = {
        title: track.name || 'Unknown Track',
        artist: track.artist?.['#text'] || 'Unknown Artist',
        album: track.album?.['#text'] || 'Unknown Album',
        artwork: track.image?.[2]?.['#text'] || '',
        isNowPlaying: track['@attr']?.nowplaying === 'true',
        lastPlayed: track.date?.['#text']
      };

      this.log('Processed track:', musicTrack);
      return musicTrack;

    } catch (error) {
      this.log('Failed to fetch recent tracks:', error);
      return null;
    }
  }

  async getUserInfo(): Promise<{ username: string; playCount?: number } | null> {
    try {
      if (!this.apiKey || !this.username) {
        return null;
      }

      const data = await this.makeRequest('user.getinfo');
      
      return {
        username: this.username,
        playCount: data.user?.playcount ? parseInt(data.user.playcount) : undefined
      };
    } catch (error) {
      this.log('Failed to fetch user info:', error);
      return null;
    }
  }

  // Test method to verify API connection
  async testConnection(): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo();
      return userInfo !== null;
    } catch (error) {
      this.log('API connection test failed:', error);
      return false;
    }
  }
}

export const lastfmService = new LastfmService(); 