import React from 'react'
import HomePageClient from '../../components/HomePageClient'
import { generateHomeSEO } from '../../lib/seo'
import { getHome } from '../../lib/api'

export async function generateMetadata({ params }) {
  try {
    const { locale } = await params;
    const homeData = await getHome(locale);
    
    if (!homeData) {
      return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH),
        title: 'Home',
        description: 'Welcome to our website',
      };
    }
    
    return generateHomeSEO(homeData);
  } catch (error) {
    console.error('Error generating homepage metadata:', error);
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH),
      title: 'Home',
      description: 'Welcome to our website',
    };
  }
}

export default async function HomePage({ params }) {
  const { locale } = await params
  
  return <HomePageClient locale={locale || 'en'} />
}