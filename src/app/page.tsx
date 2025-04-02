'use client';
import { useEffect, useState, useRef } from 'react';

interface Photo {
  id: string;
  urls: {
    small: string;
    full: string;
  };
  alt_description: string;
}

export default function Home() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const photoRef = useRef<HTMLImageElement>(null);

  const gap = 16;

  useEffect(() => {
    const url = `https://api.unsplash.com/photos?page=1&per_page=20&client_id=${API_KEY}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data);
        } else if (data.errors) {
          console.error('Error from Unsplash API:', data.errors);
        } else if (data.results) {
          if (Array.isArray(data.results)) {
            setPhotos(data.results);
          } else {
            console.error("Error: Data from Unsplash API is a search result, but the results key is not an array.", data);
          }
        } else {
          console.error("Error: Unexpected data from Unsplash API:", data);
        }
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, []);

  useEffect(() => {
      // Function to handle keydown events
      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'ArrowDown') {
              event.preventDefault(); // Prevent default down arrow behavior
              setSelectedImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
          }
          if (event.key === 'ArrowUp') {
              event.preventDefault(); // Prevent default down arrow behavior
              setSelectedImageIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
          }
      };

      // Add event listener for keydown
      window.addEventListener('keydown', handleKeyDown);

      // Cleanup: Remove event listener when component unmounts
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
    }, [photos.length]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
            <div className="max-w-[800px] w-full p-4 relative">
                {photos.length > 0 &&
                    photos.map((photo, index) => {
                        const isSelected = index === selectedImageIndex;
                        return (
                            <div
                                key={`${photo.id}-${index}`}
                                className={`absolute transition-transform duration-500`}
                                style={{ top: '50%', left: '50%', marginTop: '-50%', marginLeft: '-50%', width: '100%', height: 'auto' }}
                            >
                                <img ref={index === selectedImageIndex ? photoRef : null} src={photo.urls.small} alt={photo.alt_description} className={`w-[600px] h-auto rounded-lg shadow-md object-cover ${isSelected ? 'block' : 'hidden'}`} />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
