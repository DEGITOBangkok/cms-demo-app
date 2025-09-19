'use client';

import { useState, useEffect } from 'react';
import { getFacebook, getInstagram } from '../lib/api';

// Custom hook for fetching social media data
export function useSocialMedia() {
  const [socialMedia, setSocialMedia] = useState({
    facebook: null,
    instagram: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both Facebook and Instagram data in parallel with error handling
        const [facebookResult, instagramResult] = await Promise.allSettled([
          getFacebook(),
          getInstagram()
        ]);

        // Handle results - use null if failed
        const facebookData = facebookResult.status === 'fulfilled' ? facebookResult.value : null;
        const instagramData = instagramResult.status === 'fulfilled' ? instagramResult.value : null;

        // Debug logging
        console.log('Facebook data:', facebookData);
        console.log('Instagram data:', instagramData);

        setSocialMedia({
          facebook: facebookData,
          instagram: instagramData
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching social media data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  return { socialMedia, loading, error };
}
