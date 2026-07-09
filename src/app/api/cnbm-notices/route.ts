import { fetchCnbmNoticeGroups } from "@/lib/cnbmNotices";

export const dynamic = "force-dynamic";

export async function GET() {
  const groups = await fetchCnbmNoticeGroups(10);

  return Response.json(
    { groups },
    { headers: { "Cache-Control": "no-store" } },
  );
}
