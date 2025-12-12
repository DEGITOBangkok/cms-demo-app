'use client';

import { useState, useEffect } from 'react';
import { getContactConfig } from '../lib/api';

// Custom hook for fetching contact configuration
export function useContact(locale = 'en') {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContactConfig(locale);
        setContactData(response);
        console.log('Contact data fetched for locale:', locale, response);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching contact data:', err);
      } finally {
        setLoading(false);
      }
    };
     fetchContact();
  }, [locale]);

  return { contactData, loading, error };
}