
'use client'

import { useState, useEffect } from 'react';

const Home = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/unsplash');
      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
      }
      const newImages = await response.json();
      setImages(prevImages => [...prevImages, ...newImages]);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading) {
        fetchImages();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Infinite Scroll Image Gallery</h1>
      <div className="grid grid-cols-1 gap-4">
        {images.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Image ${index}`} className="w-full h-auto" />
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading more images...</p>}
    </div>
  );
}

export default Home;
