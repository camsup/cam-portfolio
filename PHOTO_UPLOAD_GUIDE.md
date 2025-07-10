# Photo Upload Instructions

## How to Add Photos to Your Personal Homepage

### Method 1: Simple Local Photos (Recommended for Personal Use)

1. **Add photos to the public folder:**
   - Place your JPG/PNG images in `public/photos/`
   - Name them descriptively (e.g., `street-1.jpg`, `city-skyline.jpg`)

2. **Update the photo data:**
   - Edit `src/photoData.ts`
   - Add your photos to the `photoGallery` array:
   ```typescript
   {
     id: 'my-photo-1',
     src: '/photos/my-photo-1.jpg',
     alt: 'Description of photo',
     category: 'STREET',
     placeholder: false  // Set to false for real photos
   }
   ```

### Method 2: Cloud Storage (Free Options)

#### Option A: GitHub (Free, Simple)
1. Upload photos to your GitHub repo in `public/photos/`
2. Use the raw GitHub URLs as src paths
3. Perfect for static hosting with GitHub Pages

#### Option B: Cloudinary (Free Tier: 25GB)
1. Sign up at cloudinary.com
2. Upload photos to your Cloudinary account
3. Use Cloudinary URLs in your photo data
4. Benefits: automatic optimization, resizing, CDN delivery

#### Option C: Unsplash (Free Stock Photos)
1. Go to unsplash.com
2. Find photos you like
3. Use the direct image URLs
4. Great for placeholder content

### Method 3: Photo Management Services

#### Option A: Google Photos + Direct Links
1. Upload to Google Photos
2. Get shareable links
3. Convert to direct image URLs
4. Note: Links may expire

#### Option B: Imgur (Free)
1. Upload to imgur.com
2. Use direct image links
3. Good for temporary hosting

### Method 4: Professional Setup

#### Option A: Supabase Storage (Free Tier: 1GB)
1. Sign up at supabase.com
2. Create a storage bucket
3. Upload photos via dashboard or API
4. Use Supabase URLs in your app

#### Option B: AWS S3 + CloudFront
1. Upload to Amazon S3
2. Configure CloudFront for CDN
3. Use AWS URLs
4. Most scalable but requires AWS knowledge

## Photo Requirements

- **Formats:** JPG, PNG, WebP
- **Size:** Recommended max 1920x1080 for web
- **Aspect Ratio:** Square (1:1) works best for the current grid
- **File Size:** Keep under 1MB for fast loading

## Quick Start (5 minutes)

1. Take some photos with your phone
2. Resize them to 800x800 pixels (use any online tool)
3. Save them in `public/photos/` as `photo-1.jpg`, `photo-2.jpg`, etc.
4. Update `src/photoData.ts` with your photo names
5. Change `placeholder: true` to `placeholder: false`

## Current Setup

Your site is currently using placeholder icons. To show real photos:
1. Add actual image files to `public/photos/`
2. Update the photo data in `src/photoData.ts`
3. Set `placeholder: false` for real photos

The photos will automatically appear in your gallery with hover effects and proper optimization!
