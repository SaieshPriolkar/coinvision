import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { from: fromCurrency, to: toCurrency, start, end } = await req.json();

    if (!fromCurrency || !toCurrency || !start || !end) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const res = await fetch(`http://api.currencylayer.com/timeframe?access_key=${process.env.CURRENCY_LAYER_API_KEY}&start_date=${start}&end_date=${end}&source=${fromCurrency}&currencies=${toCurrency}`);

    const data = await res.json();

    if (!data || data.success === false) {
      return NextResponse.json({ error: "API request failed", details: data }, { status: 400 });
    }

    const pairKey = `${fromCurrency}${toCurrency}`;

    // Correct use of Object.entries with type annotation on parameters:
    const ratesArray = Object.entries(data.quotes).map(([date, values]) => {
      const quoteObj = values as Record<string, number>;
      return {
        date,
        rate: quoteObj[pairKey],
      };
    });

    return NextResponse.json({ from: fromCurrency, to: toCurrency, rates: ratesArray });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 });
  }}