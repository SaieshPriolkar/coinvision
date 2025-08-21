// ChartConfig.ts
export type SeriesConfig = {
  id: string;
  label: string;
  yAxisLabel: string;
  color: string;
};

export type MarketConfig = {
  marketName: string;
  currencyCode: string;
  series: SeriesConfig[];
};

export const markets: MarketConfig[] = [
  {
    marketName: "Currency Markets",
    currencyCode: "USD",
    series: [
      { id: "DTWEXBGS", label: "US Dollar Index (Broad)", yAxisLabel: "Index", color: "#264653" },
      { id: "DEXUSEU", label: "USD/EUR", yAxisLabel: "USD per EUR", color: "#2a9d8f" },
      { id: "DEXUSUK", label: "USD/GBP", yAxisLabel: "USD per GBP", color: "#e76f51" },
      { id: "DEXJPUS", label: "USD/JPY", yAxisLabel: "JPY per USD", color: "#457b9d" },
      { id: "DEXCHUS", label: "USD/CHF", yAxisLabel: "CHF per USD", color: "#8d99ae" },
      { id: "DEXINUS", label: "USD to INR Exchange Rate", yAxisLabel: "INR per USD", color: "#e76f51" },
    ],
  },
];