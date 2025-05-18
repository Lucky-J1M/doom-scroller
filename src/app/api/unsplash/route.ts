import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const unsplashApiKey = process.env.UNSPLASH_API_KEY;

    if (!unsplashApiKey) {
      return res.status(500).json({ error: 'Unsplash API key not configured' });
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=10&client_id=${unsplashApiKey}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Unsplash API error:', errorData);
        return res.status(response.status).json({ error: 'Failed to fetch images from Unsplash' });
      }

      const images = await response.json();
      const imageUrls = images.map((image: any) => image.urls.regular);

      res.status(200).json(imageUrls);
    } catch (error) {
      console.error('Server error fetching images:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}