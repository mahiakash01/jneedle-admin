import { NextRequest, NextResponse } from "next/server";
import auth from "./appwrite/auth";
import toast from "react-hot-toast";
import service from "./appwrite/config";

export async function middleware(req: NextRequest) {
  const user = await auth.getUser();

  // If no user, redirect to login
  if (!user) {
    req.cookies.delete("session");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Adjust the matcher to protect all routes except the login route
export const config = {
  matcher: [
    '/((?!login|api|favicon.ico|_next/static|_next/image|images).*)',
    "/api/pages/update-pageItem",
    
  ]
};
