// Photo gallery types and data
export interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  placeholder?: boolean;
}

export const photoGallery: PhotoItem[] = [
  {
    id: 'street-1',
    src: '/photos/street-1.jpg',
    alt: 'Street Photography',
    category: 'STREET',
    placeholder: true
  },
  {
    id: 'city-1',
    src: '/photos/city-1.jpg',
    alt: 'City Landscape',
    category: 'CITY',
    placeholder: true
  },
  {
    id: 'architecture-1',
    src: '/photos/architecture-1.jpg',
    alt: 'Architecture',
    category: 'ARCHITECTURE',
    placeholder: true
  },
  {
    id: 'portrait-1',
    src: '/photos/portrait-1.jpg',
    alt: 'Portrait',
    category: 'PORTRAITS',
    placeholder: true
  }
];

// Photo categories with icons
export const photoCategories = {
  STREET: '📷',
  CITY: '🌃',
  ARCHITECTURE: '🏛️',
  PORTRAITS: '🎭'
};
