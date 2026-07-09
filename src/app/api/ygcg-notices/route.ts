import { fetchYgcgNoticeGroups } from "@/lib/ygcgNotices";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limitParam = new URL(request.url).searchParams.get("limit");
  const parsedLimit = Number(limitParam);
  const pageSize = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 20) : 10;
  const groups = await fetchYgcgNoticeGroups(pageSize);

  return Response.json(
    { groups },
    { headers: { "Cache-Control": "no-store" } },
  );
}
