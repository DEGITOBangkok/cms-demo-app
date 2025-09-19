import React from 'react'
import HomePageClient from '../../components/HomePageClient'

export default async function HomePage({ params }) {
  const { locale } = await params
  
  return <HomePageClient locale={locale || 'en'} />
}