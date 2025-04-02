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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselOffset, setCarouselOffset] = useState(0);

  const API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
        observer.observe(loader.current);
    }

      // Function to handle keydown events
      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'ArrowDown') {
              event.preventDefault(); // Prevent default down arrow behavior
              if (photoRef.current) {
                  const imageHeight = photoRef.current.offsetHeight;
                  setCarouselOffset((prevOffset) => prevOffset - imageHeight - 16);
              }
          }
          if (event.key === 'ArrowUp') {
              event.preventDefault(); // Prevent default down arrow behavior
              if (photoRef.current) {
                  const imageHeight = photoRef.current.offsetHeight;
                  setCarouselOffset((prevOffset) => prevOffset + imageHeight + 16);
              }
          }
      };

      // Add event listener for keydown
      window.addEventListener('keydown', handleKeyDown);

      // Cleanup: Remove event listener when component unmounts
      return () => {
          if (loader.current) {
              observer.unobserve(loader.current);
          }
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, []);

  useEffect(() => {
    if (loading) {
      const url = `https://api.unsplash.com/photos?page=${page}&per_page=20&client_id=${API_KEY}`;
      fetch(url)
          .then((response) => response.json())
          .then((data) => {
              if (Array.isArray(data)) {
                  setPhotos((prevPhotos) => [...prevPhotos, ...data]);
              } else if (data.errors) {
                  console.error('Error from Unsplash API:', data.errors);
              } else if (data.results) {
                  if (Array.isArray(data.results)) {
                      setPhotos((prevPhotos) => [...prevPhotos, ...data.results]);
                  } else {
                      console.error("Error: Data from Unsplash API is a search result, but the results key is not an array.", data);
                  }
              } else {
                  console.error("Error: Unexpected data from Unsplash API:", data);
              }
              setLoading(false);
          })
          .catch((error) => {
              console.error('Error fetching photos:', error);
              setLoading(false);
          });
    }
  }, [loading, page, API_KEY]);
    useEffect(() => {
        if (photos.length > 0 && containerRef.current && photoRef.current) {
            const containerHeight = containerRef.current.offsetHeight;
            const imageHeight = photoRef.current.offsetHeight;
            const totalCarouselHeight = (imageHeight + 16) * photos.length;

            if (carouselOffset < -totalCarouselHeight) {
                setCarouselOffset(carouselOffset + totalCarouselHeight);
            }
            if (carouselOffset > totalCarouselHeight) {
                setCarouselOffset(carouselOffset - totalCarouselHeight);
            }
        }
    }, [carouselOffset, photos]);
    useEffect(() => {
        setLoading(true)
    }, [page])

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting) {
      setPage((prevPage) => prevPage + 1);
      setLoading(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <div ref={containerRef} className="max-w-[800px] w-full p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Infinite Scroll of Images
        </h1>
        {photos.length > 0 ? (
          <div className="max-w-[600px] relative">
            {photos.map((photo, index) => (
              <div key={`${photo.id}-${index}`} className="absolute"
                  style={{ transform: `translateY(${carouselOffset + (index * (photoRef.current ? photoRef.current.offsetHeight : 0) + (index * 16))}px)` }}>
                <img 
                    ref={index === 0 ? photoRef : null}
                    
                    ref={index === 0 ? photoRef : null}
                    src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500"></div>
          </div>
        )}
        
          {loading && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
           )}
          
      
      </div>
    </div>
  );
}

