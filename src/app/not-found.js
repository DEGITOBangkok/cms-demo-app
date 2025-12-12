import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Page Not Found | Prom Serve',
    description: 'The page you are looking for could not be found.',
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
        { url: '/favicon.ico', type: 'image/x-icon' }
      ],
    },
  };
}

export default function NotFound() {
  // Redirect to locale-specific not-found page to preserve translations
  redirect('/en/not-found');
}