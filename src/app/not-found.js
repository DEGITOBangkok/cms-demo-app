import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Page Not Found | News Portal',
    description: 'The page you are looking for could not be found.',
  };
}

export default function NotFound() {
  // Redirect to locale-specific not-found page to preserve translations
  redirect('/en/not-found');
}