import { fetchCeecNoticeGroups } from "@/lib/ceecNotices";

export const dynamic = "force-dynamic";

export async function GET() {
  const groups = await fetchCeecNoticeGroups(10);

  return Response.json(
    { groups },
    { headers: { "Cache-Control": "no-store" } },
  );
}
