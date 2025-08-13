import { NextResponse } from "next/server";

const FRED_API_KEY = process.env.FRED_API_KEY!;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const seriesId = url.searchParams.get("series_id");

  if (!seriesId) {
    return NextResponse.json({ error: "Missing series_id parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from FRED" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}