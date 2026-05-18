// lib/routes.ts - Centralized route definitions

export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  ROOT: '/',

  // Protected routes
  DASHBOARD: '/dashboard',
  PARTNERS: '/partners',
  PARTNERS_NEW: '/partners/new',
  PARTNERS_DETAIL: (id: string) => `/partners/${id}`,
  PARTNERS_EDIT: (id: string) => `/partners/${id}/edit`,

  STUDENTS: '/students',
  STUDENTS_NEW: '/students/new',

  INTERACTIONS: '/interactions',
  INTERACTIONS_NEW: '/interactions/new',

  EMAIL: '/email',

  ACTIVITY_LOG: '/activity-log',

  SETTINGS: '/settings',

  ADMIN: '/admin',

  SEARCH: '/search',

  // Auth
  AUTH_GOOGLE_CALLBACK: '/auth/google/callback',

  // Error pages
  NOT_FOUND: '/not-found',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

/**
 * Check if a route is public (no authentication required)
 */
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [ROUTES.LOGIN, ROUTES.ROOT, ROUTES.AUTH_GOOGLE_CALLBACK];
  return publicRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route is protected (authentication required)
 */
export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname) && !pathname.startsWith('/api') && !pathname.startsWith('/_next');
}
