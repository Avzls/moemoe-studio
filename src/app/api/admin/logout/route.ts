import { NextResponse } from "next/server";
import { getTokenCookieOptions } from "@/lib/auth";

export async function POST() {
  const cookieOptions = getTokenCookieOptions();
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    ...cookieOptions,
    value: "",
    maxAge: 0,
  });
  return response;
}
