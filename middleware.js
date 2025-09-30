import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Handle root path redirect to newslist
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en/newslist', request.url));
  }

  // Check if the first segment is an invalid locale
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const firstSegment = segments[0];
    const validLocales = routing.locales;
    
    // If first segment is not a valid locale, redirect to not-found
    if (!validLocales.includes(firstSegment)) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};