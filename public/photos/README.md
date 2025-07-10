# Sample Photo Instructions

Since we can't create actual image files through this interface, here's how to add real photos:

## Quick Test Photos (from Unsplash - Free to use)

1. **Street Photography:**
   - Download: https://unsplash.com/photos/city-street-photography
   - Save as: `public/photos/street-1.jpg`

2. **City Skyline:**
   - Download: https://unsplash.com/photos/city-skyline
   - Save as: `public/photos/city-1.jpg`

3. **Architecture:**
   - Download: https://unsplash.com/photos/modern-architecture
   - Save as: `public/photos/architecture-1.jpg`

4. **Portrait:**
   - Download: https://unsplash.com/photos/portrait-photography
   - Save as: `public/photos/portrait-1.jpg`

## Update Photo Data

After adding the images, update `src/photoData.ts`:

```typescript
export const photoGallery: PhotoItem[] = [
  {
    id: 'street-1',
    src: '/photos/street-1.jpg',
    alt: 'Street Photography',
    category: 'STREET',
    placeholder: false  // Change this to false
  },
  // ... repeat for other photos
];
```

The photos will then show up in your gallery instead of the placeholder icons!
