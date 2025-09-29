'use client';

import { useState, useEffect } from 'react';
import { getSocial } from '../lib/api';

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
        
        // Fetch all social media data
        const socialData = await getSocial();

        // Debug logging
        console.log('Social data:', socialData);

        setSocialMedia(socialData);
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
