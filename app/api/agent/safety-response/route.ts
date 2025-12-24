import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pendingSafetyResponses = new Map<string, (acknowledged: boolean) => void>();

export function createSafetyConfirmationPromise(
  sessionId: string,
  confirmationId: string
): Promise<boolean> {
  const key = `${sessionId}:${confirmationId}`;
  return new Promise((resolve) => {
    pendingSafetyResponses.set(key, resolve);
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, confirmationId, acknowledged } = body;

  if (!sessionId || !confirmationId || typeof acknowledged !== "boolean") {
    return NextResponse.json(
      { success: false, error: "Missing required fields: sessionId, confirmationId, acknowledged" },
      { status: 400 }
    );
  }

  const key = `${sessionId}:${confirmationId}`;
  const resolve = pendingSafetyResponses.get(key);

  if (!resolve) {
    return NextResponse.json(
      { success: false, error: "No pending safety confirmation found" },
      { status: 404 }
    );
  }

  resolve(acknowledged);
  pendingSafetyResponses.delete(key);

  return NextResponse.json({ success: true, acknowledged });
}

