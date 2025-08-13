"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { markets, MarketConfig, SeriesConfig } from "./ChartConfig";
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

  const defaultMarket = markets.find((m) => m.marketName === "Indian Markets") ?? markets[0];
  const [selectedMarket, setSelectedMarket] = useState<MarketConfig>(defaultMarket);
  const [selectedSeries, setSelectedSeries] = useState<SeriesConfig>(defaultMarket.series[0]);

  const [initialInvestment, setInitialInvestment] = useState<number>(1000);
  const [nominalRate, setNominalRate] = useState<number>(0.05); // default 5%
  const [years, setYears] = useState<number>(5);

  const [inflationRate, setInflationRate] = useState<number>(0);
  const [nominalFinalValue, setNominalFinalValue] = useState<number | null>(null);
  const [realFinalValue, setRealFinalValue] = useState<number | null>(null);

  const [realValueSeries, setRealValueSeries] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    async function fetchSeries(series: SeriesConfig) {
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

  // Get inflation rate whenever series changes
  useEffect(() => {
    const data = allData[selectedSeries.id];
    if (data && data.length > 0) {
      const latestValue = data[data.length - 1].value;
      setInflationRate(latestValue / 100); // convert % to decimal
    }
  }, [selectedSeries, allData]);

  // Calculate Nominal & Real Final Values + Series
  useEffect(() => {
    if (inflationRate !== null) {
      const nominalValue = initialInvestment * Math.pow(1 + nominalRate, years);
      const realValue = nominalValue / Math.pow(1 + inflationRate, years);
      setNominalFinalValue(nominalValue);
      setRealFinalValue(realValue);

      // Build dataset for each year
      const seriesData = Array.from({ length: years }, (_, i) => {
        const year = i + 1;
        const nominal = initialInvestment * Math.pow(1 + nominalRate, year);
        const real = nominal / Math.pow(1 + inflationRate, year);
        return { date: `${year}`, value: real };
      });
      setRealValueSeries(seriesData);
    }
  }, [initialInvestment, nominalRate, years, inflationRate]);

  const handleMarketChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const marketName = e.target.value;
    const market = markets.find((m) => m.marketName === marketName);
    if (market) {
      setSelectedMarket(market);
      setSelectedSeries(market.series[0]); // reset to first series
    }
  };

  const handleSeriesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const seriesId = e.target.value;
    const series = selectedMarket.series.find((s) => s.id === seriesId);
    if (series) setSelectedSeries(series);
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading dashboard data...</p>;

  return (
    <div className="min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-600 to-indigo-600">
      <h1 style={{ textAlign: "center", marginBottom: 32, color: "white" }}>
        Global Inflation & Market Dashboard
      </h1>

      {/* Market Selector */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <label htmlFor="market-select" style={{ marginRight: 12, fontWeight: "bold", color: "white" }}>
          Select Market:
        </label>
        <select
          id="market-select"
          value={selectedMarket.marketName}
          onChange={handleMarketChange}
          style={{ padding: "6px 12px", borderRadius: 4, background: "black", color: "white" }}
        >
          {markets.map((market) => (
            <option key={market.marketName} value={market.marketName}>
              {market.marketName}
            </option>
          ))}
        </select>
      </div>

      {/* Series Selector */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <label htmlFor="series-select" style={{ marginRight: 12, fontWeight: "bold", color: "white" }}>
          Select Series:
        </label>
        <select
          id="series-select"
          value={selectedSeries.id}
          onChange={handleSeriesChange}
          style={{ padding: "6px 12px", borderRadius: 4, background: "black", color: "white" }}
        >
          {selectedMarket.series.map((series) => (
            <option key={series.id} value={series.id}>
              {series.label}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Calculator */}
      <div style={{ textAlign: "center", marginBottom: 40, color: "white" }}>
        <h3>Investment Calculator</h3>
        <div style={{ marginBottom: 8 }}>
          Initial Investment:{" "}
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(Number(e.target.value))}
            style={{ padding: 4, marginLeft: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          Nominal Rate (%):{" "}
          <input
            type="number"
            value={nominalRate * 100}
            onChange={(e) => setNominalRate(Number(e.target.value) / 100)}
            style={{ padding: 4, marginLeft: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          Years:{" "}
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            style={{ padding: 4, marginLeft: 8 }}
          />
        </div>
        <p>📊 Present Inflation Rate: {(inflationRate * 100).toFixed(2)}%</p>
        {nominalFinalValue !== null && realFinalValue !== null && (
          <>
            <p>💰 Nominal Final Value: {nominalFinalValue.toFixed(2)}</p>
            <p>🏦 Real Final Value (adjusted for inflation): {realFinalValue.toFixed(2)}</p>
          </>
        )}
        {/* New Real Final Value Chart */}
          {realValueSeries.length > 0 && (
            <GenericChart
              data={realValueSeries}
              label="Real Final Value Over Time"
              yAxisLabel="Value"
              color="#FFD700"
            />
          )}
      </div>

      {/* Charts */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: 6, marginBottom: 20, color: "white" }}>
          {selectedMarket.marketName}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 24,
          }}
        >
          {selectedMarket.series.map((series) => {
            const data = allData[series.id] ?? [];
            return (
              <GenericChart
                key={series.id}
                data={data}
                label={series.label}
                yAxisLabel={series.yAxisLabel}
                color={series.color}
              />
            );
          })}

          
        </div>
      </section>
    </div>
  );
}
