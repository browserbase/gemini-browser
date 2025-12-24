import { NextRequest, NextResponse } from "next/server";
import { resolveSafetyConfirmation } from "./state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, confirmationId, acknowledged } = body;

  if (!sessionId || !confirmationId || typeof acknowledged !== "boolean") {
    return NextResponse.json(
      { success: false, error: "Missing required fields: sessionId, confirmationId, acknowledged" },
      { status: 400 }
    );
  }

  const resolved = resolveSafetyConfirmation(sessionId, confirmationId, acknowledged);

  if (!resolved) {
    return NextResponse.json(
      { success: false, error: "No pending safety confirmation found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, acknowledged });
}
