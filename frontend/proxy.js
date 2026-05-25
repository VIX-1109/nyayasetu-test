import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const protectedRoutes = [
  { prefix: '/client', roles: ['client'] },
  { prefix: '/advocate/dashboard', roles: ['advocate'], verifiedAdvocate: true },
  { prefix: '/advocate/verification', roles: ['advocate'] },
  { prefix: '/admin', roles: ['admin'] },
  { prefix: '/messages', roles: ['client', 'advocate', 'admin'] },
  { prefix: '/profile', roles: ['client', 'advocate', 'admin'] },
];

const dashboardFor = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'advocate') return '/advocate/dashboard';
  return '/client/dashboard';
};

const findRoute = (pathname) => protectedRoutes.find((route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`));

export async function proxy(request) {
  const route = findRoute(request.nextUrl.pathname);
  if (!route) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (!user.email_confirmed_at) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('verify_email', '1');
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = profile?.role || 'client';
  if (!route.roles.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (route.verifiedAdvocate) {
    const { data: advocate } = await supabase
      .from('advocates')
      .select('verification_status')
      .eq('id', user.id)
      .maybeSingle();

    if (advocate?.verification_status !== 'verified') {
      const url = request.nextUrl.clone();
      url.pathname = '/advocate/verification';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/client/:path*', '/advocate/:path*', '/admin/:path*', '/messages/:path*', '/profile/:path*'],
};
