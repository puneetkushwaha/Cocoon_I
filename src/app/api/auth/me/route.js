import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cocoon_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false, role: null, user: null });
    }

    const session = verifySessionToken(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ authenticated: false, role: null, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      role: session.role,
      user: session.user || (session.role === "admin" ? { email: session.email, name: "Mehak (Studio Admin)" } : null)
    });
  } catch (e) {
    return NextResponse.json({ authenticated: false, role: null, user: null });
  }
}
