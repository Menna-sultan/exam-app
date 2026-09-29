// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);

// export default async function proxy(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
//   const pathname = request.nextUrl.pathname;
//   const isDashboardRoute = pathname.startsWith("/dashboard");
//   const isDiplomaRoute = pathname.startsWith("/diplomas");
//   const role = token?.user?.role;

//   if (isDashboardRoute && (!token || !role)) {
//     return redirectToLogin(request);
//   }

//   if (isDashboardRoute && !ADMIN_ROLES.has(role)) {
//     return NextResponse.redirect(new URL("/diplomas", request.url));
//   }

//   if (isDiplomaRoute && token && ADMIN_ROLES.has(role)) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// function redirectToLogin(request: NextRequest) {
//   const loginUrl = new URL("/login", request.url);
//   loginUrl.searchParams.set(
//     "callbackUrl",
//     `${request.nextUrl.pathname}${request.nextUrl.search}`
//   );
//   return NextResponse.redirect(loginUrl);
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/diplomas/:path*"],
// };
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);

export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isDiplomaRoute = pathname.startsWith("/diplomas");
  const role = token?.user?.role;

  // Dashboard requires authentication
  if (isDashboardRoute && (!token || !role)) {
    return redirectToLogin(request);
  }

  // Only ADMIN and SUPER_ADMIN can access dashboard
  if (isDashboardRoute && !ADMIN_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/diplomas", request.url));
  }

  // Diplomas requires authentication
  if (isDiplomaRoute && !token) {
    return redirectToLogin(request);
  }

  // Admins are redirected from diplomas to dashboard
  if (isDiplomaRoute && token && ADMIN_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/diplomas/:path*"],
};