export const runtime = "edge";

import { NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/auth";

export async function POST() {
  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": buildClearCookieHeader() } }
  );
}
