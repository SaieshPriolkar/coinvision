"use client";
import React, { useEffect, useState } from "react";
import { markets } from "./ChartConfig";
import GenericChart from "./GenericChart";

type Observation = {
  date: string;
  value: string;
};

function parseValues(data: Observation[]) {
  return data
    .map((d) => ({
      date: d.date,
      value: parseFloat(d.value),
    }))
    .filter((d) => !isNaN(d.value));
}

export default function Dashboard() {
  const [allData, setAllData] = useState<Record<string, { date: string; value: number }[]>>({});
  const [loading, setLoading] = useState(true);

  const [noteInput, setNoteInput] = useState(""); // e.g. INR-200
  const [historicalValue, setHistoricalValue] = useState<number | null>(null);
  const [historicalYear, setHistoricalYear] = useState<number | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [yearsAgo, setYearsAgo] = useState(20);
  const [compareCurrency, setCompareCurrency] = useState("USD");

  // Get all available currencies from ChartConfig
  const availableCurrencies = Array.from(
    new Set(
      markets
        .flatMap((m) => m.series)
        .flatMap((s) =>
          s.label.match(/[A-Z]{3}/g) || []
        )
    )
  );

  useEffect(() => {
    async function fetchSeries(series: { id: string }) {
      const res = await fetch(`/api/fred?series_id=${series.id}`);
      if (!res.ok) throw new Error(`Failed to load ${series.id}`);
      const json = await res.json();
      return { id: series.id, data: parseValues(json.observations) };
    }

    async function fetchAll() {
      setLoading(true);
      try {
        const seriesList = markets.flatMap((m) => m.series);
        const results = await Promise.all(seriesList.map(fetchSeries));
        const newData: Record<string, { date: string; value: number }[]> = {};
        for (const res of results) {
          newData[res.id] = res.data;
        }
        setAllData(newData);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // Handler for INR-200 input and comparison currency
  const handleNoteInput = () => {
    const match = noteInput.match(/^([A-Z]{3})-(\d+)$/);
    if (!match) {
      alert("Please enter in format CUR-amount, e.g., INR-200");
      setSelectedSeries(null);
      setHistoricalValue(null);
      setHistoricalYear(null);
      return;
    }
    const baseCurrency = match[1];
    const amount = parseFloat(match[2]);
    const market = markets.find((m) => m.marketName === "Currency Markets");
    if (!market) {
      setSelectedSeries(null);
      return;
    }

    // Find a series that matches the selected pair (e.g., USD/INR, USD/EUR, etc.)
    let series =
      market.series.find(
        (s) =>
          (s.label.includes(baseCurrency) && s.label.includes(compareCurrency)) ||
          (s.label.includes(compareCurrency) && s.label.includes(baseCurrency))
      ) ||
      // fallback: find any series that includes the base currency
      market.series.find((s) => s.label.includes(baseCurrency));

    if (!series) {
      alert("Currency pair not found in series.");
      setSelectedSeries(null);
      return;
    }
    setSelectedSeries(series);

    const data = allData[series.id];
    if (!data || data.length === 0) {
      alert("No data available for this currency pair.");
      setHistoricalValue(null);
      setHistoricalYear(null);
      return;
    }

    // Use user-specified yearsAgo (clamp to available data)
    const idx = Math.max(0, data.length - yearsAgo * 12);
    const oldRate = data[idx]?.value;
    if (!oldRate) {
      alert("Not enough historical data.");
      setHistoricalValue(null);
      setHistoricalYear(null);
      return;
    }

    // Calculate value: if series is "USD to INR", and user input is INR-200, show what 200 INR was in USD
    let value = 0;
    if (series.label.includes(baseCurrency) && series.label.includes(compareCurrency)) {
      // If label is "USD to INR Exchange Rate", and input is INR-200, then 200 INR / rate = USD
      if (series.label.includes("to")) {
        const [from, to] = series.label.split(" to ");
        if (from.includes(baseCurrency) && to.includes(compareCurrency)) {
          value = amount / oldRate;
        } else {
          value = amount * oldRate;
        }
      } else {
        value = amount * oldRate;
      }
    } else {
      value = amount * oldRate;
    }

    setHistoricalValue(value);
    setHistoricalYear(new Date().getFullYear() - yearsAgo);
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading dashboard data...</p>;

  // Prepare data for the 50-year graph
  let chartData: { date: string; value: number }[] = [];
  let chartLabel = "";
  let chartYAxis = "";
  let chartColor = "";
  if (selectedSeries && allData[selectedSeries.id]) {
    const data = allData[selectedSeries.id];
    const months = 50 * 12;
    chartData = data.slice(-months);
    chartLabel = selectedSeries.label;
    chartYAxis = selectedSeries.yAxisLabel;
    chartColor = selectedSeries.color;
  }

  return (
    <div className="min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-600 to-indigo-600">
      <h1 style={{ textAlign: "center", marginBottom: 32, color: "white" }}>
        Global Inflation & Market Dashboard
      </h1>

      {/* Input for CUR-amount, years ago, and comparison currency */}
      <div style={{ textAlign: "center", marginBottom: 24, color: "white" }}>
        <h3>Check Historical Value</h3>
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="INR-200"
          style={{ padding: 4, marginRight: 8 }}
        />
        <input
          type="number"
          min={1}
          max={80}
          value={yearsAgo}
          onChange={(e) => setYearsAgo(Number(e.target.value))}
          placeholder="Years ago"
          style={{ padding: 4, width: 80, marginRight: 8 }}
        />
        <select
          value={compareCurrency}
          onChange={(e) => setCompareCurrency(e.target.value)}
          style={{ padding: 4, marginRight: 8, borderRadius: 4 }}
        >
          {availableCurrencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
        <button
          onClick={handleNoteInput}
          style={{
            padding: "4px 12px",
            borderRadius: 4,
            background: "#FFD700",
            color: "black",
          }}
        >
          Show Value
        </button>
        {historicalValue !== null && historicalYear !== null && (
          <div style={{ marginTop: 12 }}>
            <strong>
              {noteInput} ≈ {historicalValue.toFixed(2)} {compareCurrency} in {historicalYear}
            </strong>
          </div>
        )}
      </div>

      {/* 50 Years Historical Graph */}
      {selectedSeries && chartData.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ color: "white", marginBottom: 12 }}>
            {chartLabel} (Last 50 Years)
          </h2>
          <GenericChart
            data={chartData}
            label={chartLabel}
            yAxisLabel={chartYAxis}
            color={chartColor}
            title={chartLabel}
            series={[
              {
                id: selectedSeries.id,
                label: chartLabel,
                yAxisLabel: chartYAxis,
                color: chartColor,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
