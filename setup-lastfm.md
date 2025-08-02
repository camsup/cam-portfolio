# 🎵 Last.fm Plugin Setup Guide

## ✅ Your Last.fm Plugin is Already Integrated!

The Last.fm plugin is already built into your `App-simple.tsx` file. It will show your recently played music below the "CAM" title.

## 🔧 To Get It Working:

### 1. Get Your Last.fm API Key
1. Go to: https://www.last.fm/api/account/create
2. Sign in with your Last.fm account
3. Create a new application:
   - **Application name**: `CAM Portfolio`
   - **Description**: `Personal portfolio website`
   - **Homepage URL**: `http://localhost:3003` (for development)
   - **Callback URL**: `http://localhost:3003`
4. **Copy your API key** (looks like: `1234567890abcdef1234567890abcdef`)

### 2. Create Environment File
```bash
# Copy the template
cp env.template .env
```

### 3. Edit .env File
Open `.env` and add your details:
```env
VITE_LASTFM_API_KEY=your_actual_api_key_here
VITE_LASTFM_USERNAME=your_lastfm_username_here
```

### 4. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 What You'll See:

Once working, you'll see:
- **Album artwork** (if available)
- **Track name**
- **Artist name**
- **Album name**
- **Live indicator** (if currently playing)
- **Updates every 30 seconds**

## 🔍 Debugging:

### Check Browser Console
Open browser console (F12) and look for:
- `[Last.fm]` messages
- Any error messages
- API response data

### Common Issues:
1. **"API key not configured"** → Check your `.env` file
2. **"User not found"** → Check your Last.fm username
3. **"No tracks found"** → Make sure you've scrobbled music recently

### Test Your API Key:
Visit this URL (replace with your details):
```
https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=YOUR_USERNAME&api_key=YOUR_API_KEY&format=json&limit=1
```

## 🎉 Success!

Once working, your page will show:
```
CAM
┌─────────────────┐
│ [Album Art]     │ Track Name
│ [Live Dot]      │ Artist Name
└─────────────────┘ Album Name
```

The plugin updates automatically every 30 seconds! 🎵 