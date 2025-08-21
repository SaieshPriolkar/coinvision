"use client";
import React, { useState, useEffect, useMemo } from "react";
import GenericChart from "./GenericChart";
import { SeriesConfig } from "./ChartConfig";
import { format } from "date-fns";

type Observation = {
  date: string;
  value: number;
};

const inflationSeries: SeriesConfig = {
  id: "CPIAUCSL",
  label: "US Consumer Price Index (CPI)",
  yAxisLabel: "Index",
  color: "#457b9d",
};

export default function InflationChart() {
  const [inputValue, setInputValue] = useState<string>("");
  const [amount, setAmount] = useState<number | null>(null);
  const [data, setData] = useState<Record<string, Observation[]>>({});
  const [error, setError] = useState<string | null>(null);

  // Parse user input and update amount state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parts = e.target.value.split("-");
    if (parts.length === 2 && parts[0].toUpperCase() === "INR" && !isNaN(parseFloat(parts[1]))) {
      setAmount(parseFloat(parts[1]));
      setError(null);
    } else {
      setAmount(null);
      setError("Please enter a value in the format: INR-200");
    }
  };

  // Fetch inflation data when component mounts
  useEffect(() => {
    async function fetchInflationData() {
      try {
        const res = await fetch(
            `https://api.stlouisfed.org/fred/series/observations?series_id=${inflationSeries.id}&api_key=${process.env.FRED_API_KEY}`
        );
        const json = await res.json();
        if (Array.isArray(json.observations)) {
          const fetchedData = json.observations.map((obs: any) => ({
            date: obs.date,
            value: parseFloat(obs.value),
          }));
          setData({ [inflationSeries.id]: fetchedData });
        } else {
          setData({ [inflationSeries.id]: [] });
        }
      } catch (err) {
        console.error("Error fetching inflation data:", err);
        setData({});
      }
    }
    fetchInflationData();
  }, []);

  // Calculate inflation-adjusted value based on user input
  const adjustedData = useMemo(() => {
    if (!amount || !data[inflationSeries.id]) {
      return [];
    }
    const cpiData = data[inflationSeries.id];
    const latestCpi = cpiData[cpiData.length - 1]?.value;

    if (!latestCpi) return [];

    return cpiData.map(obs => ({
      date: format(new Date(obs.date), "MMM yyyy"),
      value: (amount * obs.value) / latestCpi,
    }));
  }, [amount, data]);

  const chartData = useMemo(() => {
      if (!adjustedData || adjustedData.length === 0) return [];
      return adjustedData.map(obs => ({
        date: obs.date,
        value: obs.value,
      }));
    }, [adjustedData]);

  const series = [{
    id: "adjustedValue",
    label: `Value of INR ${amount} Over Time`,
    yAxisLabel: "INR",
    color: "#2a9d8f",
  }];

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", margin: "20px 0" }}>
      <h2>Inflation Impact Calculator</h2>
      <p>Enter the Indian Rupee amount you want to analyze (e.g., INR-500).</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="e.g., INR-200"
        style={{ padding: "8px", width: "200px", borderRadius: "4px", border: "1px solid #ccc", marginRight: "10px" }}
      />
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {amount && adjustedData.length > 0 && (
        <GenericChart
          title={`Inflation-Adjusted Value of INR ${amount}`}
          label="Inflation Chart"
          data={chartData}
          series={series}
          yAxisLabel="INR"
          color="#2a9d8f"
        />
      )}
    </div>
  );
}