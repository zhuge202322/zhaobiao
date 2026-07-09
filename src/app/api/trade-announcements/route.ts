import {
  fetchTradeAnnouncements,
  fallbackTradeAnnouncements,
  tradeAnnouncementSourceUrl,
} from "@/lib/tradeAnnouncements";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await fetchTradeAnnouncements();

    return Response.json(
      { source: tradeAnnouncementSourceUrl, items },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1800" } },
    );
  } catch {
    return Response.json(
      { source: tradeAnnouncementSourceUrl, items: fallbackTradeAnnouncements },
      { headers: { "Cache-Control": "public, s-maxage=300" } },
    );
  }
}
