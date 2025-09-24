'use client';

import { useState, useEffect } from 'react';
import { getArticles, getFeaturedArticles, searchArticles, getCategories, getHome } from '../lib/api';

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

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

        const response = await getArticles({
          sort: strapiSort,
          pagination: { page: 1, pageSize: 10 },
          locale: locale
        });
        
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
  }, [sortValue, locale]); // Added locale to dependencies

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
    if (!query || query.length < 2) {
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCategories(locale);
        setCategories(response.data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [locale]);

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
