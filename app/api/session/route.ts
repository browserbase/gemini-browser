import { NextResponse } from "next/server";
import Browserbase from "@browserbasehq/sdk";
import { get, getAll } from "@vercel/edge-config";

type BrowserbaseRegion =
  | "us-west-2"
  | "us-east-1"
  | "eu-central-1"
  | "ap-southeast-1";

// Timezone abbreviation to region mapping
const timezoneAbbreviationMap: Record<string, BrowserbaseRegion> = {
  // US East Coast
  EST: "us-east-1",
  EDT: "us-east-1",

  // US West Coast
  PST: "us-west-2",
  PDT: "us-west-2",

  // US Mountain/Central - route to appropriate region
  MST: "us-west-2",
  MDT: "us-west-2",
  CST: "us-east-1",
  CDT: "us-east-1",

  // Europe
  GMT: "eu-central-1",
  BST: "eu-central-1",
  CET: "eu-central-1",
  CEST: "eu-central-1",
  EET: "eu-central-1",
  EEST: "eu-central-1",
  WET: "eu-central-1",
  WEST: "eu-central-1",

  // Asia-Pacific
  JST: "ap-southeast-1", // Japan Standard Time
  KST: "ap-southeast-1", // Korea Standard Time
  IST: "ap-southeast-1", // India Standard Time
  AEST: "ap-southeast-1", // Australian Eastern Standard Time
  AEDT: "ap-southeast-1", // Australian Eastern Daylight Time
  AWST: "ap-southeast-1", // Australian Western Standard Time
  NZST: "ap-southeast-1", // New Zealand Standard Time
  NZDT: "ap-southeast-1", // New Zealand Daylight Time
};

// Probability distributions for region routing
const distributions: Record<
  BrowserbaseRegion,
  Record<BrowserbaseRegion, number>
> = {
  "us-west-2": {
    "us-west-2": 100,
    "us-east-1": 0,
    "eu-central-1": 0,
    "ap-southeast-1": 0,
  },
  "us-east-1": {
    "us-east-1": 100,
    "us-west-2": 0,
    "eu-central-1": 0,
    "ap-southeast-1": 0,
  },
  "eu-central-1": {
    "eu-central-1": 100,
    "us-east-1": 0,
    "us-west-2": 0,
    "ap-southeast-1": 0,
  },
  "ap-southeast-1": {
    "ap-southeast-1": 100,
    "eu-central-1": 0,
    "us-west-2": 0,
    "us-east-1": 0,
  },
};

function selectRegionWithProbability(
  baseRegion: BrowserbaseRegion
): BrowserbaseRegion {
  const distribution = distributions[baseRegion];
  const random = Math.random() * 100; // Generate random number between 0-100

  let cumulativeProbability = 0;
  for (const [region, probability] of Object.entries(distribution)) {
    cumulativeProbability += probability;
    if (random < cumulativeProbability) {
      return region as BrowserbaseRegion;
    }
  }

  // Fallback to base region if something goes wrong
  return baseRegion;
}

function getRegionFromTimezoneAbbr(timezoneAbbr?: string): BrowserbaseRegion {
  try {
    if (!timezoneAbbr) {
      return "us-west-2"; // Default if no timezone provided
    }

    // Direct lookup from timezone abbreviation
    const region = timezoneAbbreviationMap[timezoneAbbr.toUpperCase()];
    if (region) {
      return region;
    }

    // Fallback to us-west-2 for unknown abbreviations
    return "us-west-2";
  } catch {
    return "us-west-2";
  }
}

interface EdgeConfig {
  advancedStealth: boolean | undefined;
  proxies: boolean | undefined;
}

async function createSession(timezone?: string) {
  const bb = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY!,
  });

  const config = await getAll<EdgeConfig>();

  console.log("config", config);

  const { advancedStealth: advancedStealthConfig, proxies: proxiesConfig } =
    config;

  const advancedStealth: boolean = advancedStealthConfig ?? false;
  const proxies: boolean = proxiesConfig ?? true;

  // Build browserSettings conditionally
  const browserSettings: Browserbase.Sessions.SessionCreateParams.BrowserSettings =
    {
      viewport: {
        width: 2560,
        height: 1440,
      },
      blockAds: true,
      advancedStealth,
      // Only set os if advancedStealth is true
      ...(advancedStealth
        ? {
            os: "mac",
          }
        : {
            os: "linux",
          }),
    };

  // Use timezone abbreviation to determine base region
  const closestRegion = getRegionFromTimezoneAbbr(timezone);
  // Apply probability routing for potential load balancing
  const finalRegion = selectRegionWithProbability(closestRegion);

  console.log("timezone abbreviation:", timezone);
  console.log("mapped to region:", closestRegion);
  console.log("final region after probability routing:", finalRegion);

  const session = await bb.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    proxies,
    browserSettings,
    keepAlive: true,
    region: finalRegion,
  });
  return {
    session,
  };
}

async function endSession(sessionId: string) {
  const bb = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY!,
  });
  await bb.sessions.update(sessionId, {
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    status: "REQUEST_RELEASE",
  });
}

async function getDebugUrl(sessionId: string) {
  const bb = new Browserbase({
    apiKey: process.env.BROWSERBASE_API_KEY!,
  });
  const session = await bb.sessions.debug(sessionId);
  return session.debuggerFullscreenUrl;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const timezone = body.timezone as string;
    const { session } = await createSession(timezone);
    const liveUrl = await getDebugUrl(session.id);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: liveUrl,
      connectUrl: session.connectUrl,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const sessionId = body.sessionId as string;
  await endSession(sessionId);
  return NextResponse.json({ success: true });
}
