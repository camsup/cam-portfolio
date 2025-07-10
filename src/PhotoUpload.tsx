import React, { useState } from 'react';

interface PhotoUploadProps {
  onPhotoAdd: (photo: { src: string; alt: string; category: string }) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoAdd }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          onPhotoAdd({
            src,
            alt: file.name,
            category: 'STREET' // Default category
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div
      className={`photo-upload ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="upload-content">
        <span className="upload-icon">📸</span>
        <p>Drag & drop photos here</p>
        <p className="upload-hint">or click to select files</p>
      </div>
    </div>
  );
};

// CSS for the upload component (add to App.css)
/*
.photo-upload {
  border: 2px dashed var(--glass-border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s var(--transition-smooth);
  cursor: pointer;
  background: var(--glass-bg);
}

.photo-upload.drag-active {
  border-color: var(--accent-primary);
  background: rgba(255, 107, 53, 0.1);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2rem;
  opacity: 0.7;
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin: 0;
}
*/
