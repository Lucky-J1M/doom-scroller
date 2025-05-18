
'use client'

import { useState, useEffect } from 'react';
import * as senza from 'senza-sdk';

const Home = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);


    // Using Unsplash Source API for random images
    const newImages = Array.from({ length: 10 }).map((_, i) => `https://api.unsplash.com/photos/random?client_id=Reg9c3clJEKlV_6zgXRykpJrgPi1JKlfV5nR7qyC-j4`);
    // Adding a slight delay to simulate network request
    // await new Promise(resolve => setTimeout(resolve, 500));
    setImages(prevImages => [...prevImages, ...newImages]);
    setLoading(false);
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


  useEffect(() => {
    console.log( "On-load Register");
    window.onload = async () => {
      try {
        await senza.init();
        senza.uiReady();
      } catch (e) {
        console.error(e);
      }
    }
  }, []);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Infinite Scroll Image Gallery</h1>
      <div className="grid grid-cols-1 gap-4">
        { images.map((imageUrl, index) => { console.log(imageUrl);  return (
          <img key={index} src={imageUrl} alt={`Image ${index}`} className="w-full h-auto" />
        )})}
      </div>
      {loading && <p className="text-center mt-4">Loading more images...</p>}
    </div>
  );
}

export default Home;
