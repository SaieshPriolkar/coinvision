"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("1M");

  const currencyList = [
    "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR",
    "NZD", "SEK", "SGD", "ZAR", "HKD", "NOK", "KRW", "MXN", "BRL"
  ];

  // Updated to support 1M, 5M, 1Y
  const getDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    if (range === "1M") start.setMonth(end.getMonth() - 1);
    if (range === "5M") start.setMonth(end.getMonth() - 5);
    if (range === "1Y") start.setFullYear(end.getFullYear() - 1);

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const fetchHistory = async (range: string) => {
    const { start, end } = getDateRange(range);
    const res = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, start, end }),
    });
    const data = await res.json();

    if (data.rates && Array.isArray(data.rates)) {
      setChartData(data.rates);
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, amount }),
      });
      const data = await res.json();
      if (data.result !== undefined) setResult(data.result);

      await fetchHistory(timeRange);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(timeRange);
    // eslint-disable-next-line
  }, [from, to, timeRange]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 w-96 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-wide drop-shadow-lg">
          💱 Currency Converter
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-3 py-2 mb-4 bg-black/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Enter amount"
        />

        <div className="flex gap-3 mb-4">
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-1/2 px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white">
            {currencyList.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>

          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-1/2 px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white">
            {currencyList.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 font-semibold"
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        {result !== null && (
          <p className="mt-6 text-lg font-bold text-center text-green-300 drop-shadow-lg">
            {amount} {from} = {result.toFixed(2)} {to}
          </p>
        )}

        {chartData && chartData.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-center gap-2 mb-3">
              {["1M", "5M", "1Y"].map((range) => (
                <button
                  key={range}
                  className={`px-3 py-1 rounded-lg ${timeRange === range ? "bg-blue-500" : "bg-blue-800"}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(5)} // show MM-DD
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={40}
                />
                <Tooltip
                  contentStyle={{ background: "#222", borderRadius: 8, color: "#fff" }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [`${value}`, `${from}→${to}`]}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#60a5fa"
                  fill="#60a5fa"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}