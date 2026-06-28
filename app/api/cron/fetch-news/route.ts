import { NextResponse } from "next/server";
import { ingestFeeds } from "@/lib/ingest";

// rss-parser and @libsql/client need the Node.js runtime (not Edge).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow time to fetch several feeds sequentially.
export const maxDuration = 60;

/**
 * Cron endpoint: pulls fresh articles from the RSS feeds into Turso.
 *
 * Triggered by Vercel Cron (see vercel.json) every 4 hours. Vercel attaches an
 * `Authorization: Bearer <CRON_SECRET>` header to scheduled invocations; we
 * verify it so the endpoint can't be hammered by the public. You can also run
 * it manually with the same header.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await ingestFeeds();
    return NextResponse.json(result, {
      status: result.ok ? 200 : 502,
    });
  } catch (error) {
    console.error("Cron ingest failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
