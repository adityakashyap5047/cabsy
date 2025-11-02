import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_HEADERS } from '@/lib/security';

export function middleware(request: NextRequest) {
  // Apply security headers to all responses
  const response = NextResponse.next();
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Additional CORS protection for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    
    // Only allow requests from your domain in production
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://cabsyio.vercel.app',
        'https://www.cabsyio.vercel.app'
      ];
      
      if (origin && !allowedOrigins.includes(origin)) {
        return new Response('Forbidden', { status: 403 });
      }
    }

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  }

  // Block access to sensitive payment pages without proper authorization
  if (request.nextUrl.pathname === '/confirmation') {
    const paymentConfirmed = request.cookies.get('payment_confirmed')?.value;
    
    if (!paymentConfirmed) {
      return NextResponse.redirect(new URL('/ride', request.url));
    }
  }

  if (request.nextUrl.pathname === '/journey') {
    const journeyActive = request.cookies.get('journey_active')?.value;
    
    if (!journeyActive) {
      return NextResponse.redirect(new URL('/ride', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
