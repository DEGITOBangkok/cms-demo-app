'use client';

import { useState, useEffect } from 'react';
import { getContactConfig } from '../lib/api';

// Custom hook for fetching contact configuration
export function useContact() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContactConfig();
        setContactData(response);
        console.log('Contact data fetched:', response);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching contact data:', err);
      } finally {
        setLoading(false);
      }
    };
     fetchContact();
  }, []);

  return { contactData, loading, error };
}