'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getArticles, getFeaturedArticles, searchArticles, getCategories, getHome } from '../lib/api';

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (type, params) => {
  return `${type}_${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Custom hook for fetching articles
export function useArticles(params = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getArticles(params);
        setArticles(response.data || []);
        setPagination(response.meta?.pagination || null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [JSON.stringify(params)]);

  return { articles, loading, error, pagination };
}

// Custom hook for fetching articles with sorting
export function useArticlesWithSort(sortValue = '', searchQuery = '', locale = 'en') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Memoize the API parameters to prevent unnecessary re-fetches
  const apiParams = useMemo(() => {
    // Convert sort value to Strapi sort format
    let strapiSort = 'publishedAt:desc'; // default
    switch (sortValue) {
      case 'newest':
        strapiSort = 'publishedAt:desc';
        break;
      case 'oldest':
        strapiSort = 'publishedAt:asc';
        break;
      case 'title-asc':
        strapiSort = 'title:asc';
        break;
      case 'title-desc':
        strapiSort = 'title:desc';
        break;
      case 'popular':
        strapiSort = 'publishedAt:desc'; // You can change this to a popularity field if you have one
        break;
      default:
        strapiSort = 'publishedAt:desc';
    }

    return {
      sort: strapiSort,
      pagination: { page: 1, pageSize: 10 },
      locale: locale
    };
  }, [sortValue, locale]);

  const fetchArticles = useCallback(async () => {
    const cacheKey = getCacheKey('articles', apiParams);
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setArticles(cachedData.data || []);
      setPagination(cachedData.meta?.pagination || null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getArticles(apiParams);
      
      // Cache the response
      setCachedData(cacheKey, response);
      
      setArticles(response.data || []);
      setPagination(response.meta?.pagination || null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  }, [apiParams]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, pagination };
}

// Custom hook for featured articles
export function useFeaturedArticles(limit = 3, locale = 'en') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFeaturedArticles(limit, locale);
        setArticles(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching featured articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit, locale || 'en']);

  return { articles, loading, error };
}

// Custom hook for search
export function useSearch(query, locale = 'en') {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchArticles(query, { locale: locale });
        setArticles(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error searching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query, locale]); // Added locale to dependencies

  return { articles, loading, error };
}

// Custom hook for fetching categories
export function useCategories(locale = 'en') {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    const cacheKey = getCacheKey('categories', { locale });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setCategories(cachedData.data || []);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getCategories(locale);
      
      // Cache the response
      setCachedData(cacheKey, response);
      
      setCategories(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error };
}

// Custom hook for fetching Home single type
export function useHome(locale = 'en') {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getHome(locale);
        setHomeData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [locale]);

  return { homeData, loading, error };
}
