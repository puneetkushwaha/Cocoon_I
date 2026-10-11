import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("cocoon_session");
    return NextResponse.json({ success: true, message: "Logged out." });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Logout failed." }, { status: 500 });
  }
}
