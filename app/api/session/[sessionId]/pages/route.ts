import Browserbase from "@browserbasehq/sdk";
import { NextResponse } from "next/server";

async function getOpenPages(sessionId: string) {
  const bb = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY!,
  });
  const debug = await bb.sessions.debug(sessionId);
  return debug.pages;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    if (!context?.params) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }
    
    const resolvedParams = await context.params;
    if (!resolvedParams?.sessionId) {
      return NextResponse.json(
        { error: "Session ID not found" },
        { status: 400 }
      );
    }
    
    const { sessionId } = resolvedParams;
    const pages = await getOpenPages(sessionId);
    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error getting pages:", error);
    return NextResponse.json(
      { error: "Failed to get pages" },
      { status: 500 }
    );
  }
}
