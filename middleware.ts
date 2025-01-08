

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/:path*']);

export default clerkMiddleware(async (auth, request) => {
  // Only protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();  // Protect route
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/(api|trpc)(.*)'],
};
