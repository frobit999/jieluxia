import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { isMutatingMethod, isSameOriginRequest } from "@/lib/security";

async function hasValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.JWT_SECRET;
  if (!secret) return true;

  return (await verifyToken(token, secret)) !== null;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/register"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));
  const isApi = pathname.startsWith("/api");
  const isAuthed = await hasValidToken(token);

  if (isApi) {
    if (
      isMutatingMethod(request.method) &&
      !isSameOriginRequest(
        request.url,
        request.headers.get("origin"),
        request.headers.get("referer")
      )
    ) {
      return NextResponse.json({ error: "跨站请求已拒绝" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (isPublic && isAuthed) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublic && !isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
