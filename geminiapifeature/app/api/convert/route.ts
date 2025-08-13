export async function POST(req: Request) {
  try {
    const { from, to, amount } = await req.json();

    const res = await fetch(
      `https://api.currencylayer.com/live?access_key=${process.env.CURRENCY_LAYER_API_KEY}&currencies=${to}&source=${from}&format=1`
    );

    const data = await res.json();

    if (!data.success) {
      return new Response(JSON.stringify({ error: data.error }), { status: 400 });
    }

    const rate = data.quotes[`${from}${to}`];
    const result = amount * rate;

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}
