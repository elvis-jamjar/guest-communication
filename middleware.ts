import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname from the request URL
  const { pathname } = request.nextUrl;

  // Extract the userId from the URL assuming the structure /admin/userid
  const userId = pathname.split("/")[2];

  // Define the allowed userId (in this case, it's 1234)
  const allowedUserId = "401354";

  // Check if the userId matches
  if (userId !== allowedUserId) {
    // If it doesn't match, redirect to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply the middleware to the /admin path
export const config = {
  matcher: "/admin/:path*",
};

/*
 *  Grid/row view vissible on both customer and admin
 *  Tittle should be in the dropdown trigger
 *  Sponsors should have label as well
 *  Allow movement of the timeline up and down
 */
