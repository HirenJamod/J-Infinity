import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isAdminRoute = pathname.startsWith('/clients') || 
                       pathname.startsWith('/create-post') || 
                       pathname.startsWith('/settings') || 
                       pathname.startsWith('/subscriptions');
  const isPortalRoute = pathname.startsWith('/portal');

  if (isAdminRoute || isPortalRoute) {
    // Check for session cookie
    // Note: In a real app with Supabase, we would use @supabase/auth-helpers-nextjs
    // For now, we'll check if the user is authenticated via the Supabase client
    // This is a simplified version for the proxy
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      // Pass the original path as a redirect param
      url.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(url);
    }

    // Role-based protection
    // We fetch the profile from the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isPortalRoute && profile?.role !== 'client') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
