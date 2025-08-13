export interface SeriesConfig {
  id: string;         // FRED series ID
  label: string;      // Chart label
  yAxisLabel: string; // Y axis label
  color: string;      // Line color
}

export interface MarketConfig {
  marketName: string;
  series: SeriesConfig[];
}

export const markets: MarketConfig[] = [
  // 1. US Financial Markets
  {
    marketName: "US Financial Markets",
    series: [
      { id: "CPIAUCSL", label: "US CPI", yAxisLabel: "CPI (Index 1982-84=100)", color: "#8884d8" },
      { id: "SP500", label: "S&P 500", yAxisLabel: "Index", color: "#82ca9d" },
      { id: "DJIA", label: "Dow Jones", yAxisLabel: "Index", color: "#ffc658" },
      { id: "NASDAQCOM", label: "NASDAQ Composite", yAxisLabel: "Index", color: "#ff7300" },
      { id: "DGS10", label: "10-Year Treasury Yield", yAxisLabel: "%", color: "#0088fe" },
      { id: "AAA", label: "Corporate Bonds (AAA)", yAxisLabel: "% Yield", color: "#00c49f" },
      { id: "BAA", label: "Corporate Bonds (BAA)", yAxisLabel: "% Yield", color: "#ff8042" },
    ],
  },

  // 2. Commodity Markets
  {
    marketName: "Commodity Markets",
    series: [
      { id: "DCOILWTICO", label: "Crude Oil (WTI)", yAxisLabel: "USD/barrel", color: "#a83279" },
      { id: "DCOILBRENTEU", label: "Crude Oil (Brent)", yAxisLabel: "USD/barrel", color: "#2ca02c" },
     // { id: "GOLDAMGBD228NLBM", label: "Gold Price", yAxisLabel: "USD/oz", color: "#ffd700" },
      //{ id: "SLVPRUSD", label: "Silver Price", yAxisLabel: "USD/oz", color: "#c0c0c0" },
      { id: "PCOPPUSDM", label: "Copper Price", yAxisLabel: "USD/metric ton", color: "#b87333" },
      { id: "PMAIZMTUSDM", label: "Maize (Corn)", yAxisLabel: "USD/metric ton", color: "#f4a261" },
      { id: "PWHEAMTUSDM", label: "Wheat", yAxisLabel: "USD/metric ton", color: "#e9c46a" },
    ],
  },

  // 3. Currency & Forex Markets
  {
    marketName: "Currency Markets",
    series: [
      { id: "DTWEXBGS", label: "US Dollar Index (Broad)", yAxisLabel: "Index", color: "#264653" },
      { id: "DEXUSEU", label: "USD/EUR", yAxisLabel: "USD per EUR", color: "#2a9d8f" },
      { id: "DEXUSUK", label: "USD/GBP", yAxisLabel: "USD per GBP", color: "#e76f51" },
      { id: "DEXJPUS", label: "USD/JPY", yAxisLabel: "JPY per USD", color: "#457b9d" },
      { id: "DEXCHUS", label: "USD/CHF", yAxisLabel: "CHF per USD", color: "#8d99ae" },
    ],
  },

  // 4. Housing & Real Estate
  {
    marketName: "Housing Market",
    series: [
      { id: "CSUSHPISA", label: "Case-Shiller US Home Price Index", yAxisLabel: "Index", color: "#ff6b6b" },
      { id: "MSPUS", label: "Median Sales Price of Houses", yAxisLabel: "USD", color: "#6a4c93" },
      { id: "MORTGAGE30US", label: "30-Year Fixed Mortgage Rate", yAxisLabel: "%", color: "#4a4e69" },
      { id: "RSAHORUSQ156S", label: "Housing Starts", yAxisLabel: "Thousands", color: "#22223b" },
    ],
  },

  // 5. Labor Market
  {
    marketName: "Labor Market",
    series: [
      { id: "UNRATE", label: "Unemployment Rate", yAxisLabel: "%", color: "#1d3557" },
     // { id: "AHEUSTOT", label: "Average Hourly Earnings", yAxisLabel: "USD", color: "#e63946" },
      { id: "CIVPART", label: "Labor Force Participation Rate", yAxisLabel: "%", color: "#f1faee" },
    ],
  },

  // 6. Broader Economy
  {
    marketName: "Macroeconomic Indicators",
    series: [
      { id: "GDP", label: "US GDP", yAxisLabel: "Billions USD", color: "#023e8a" },
      { id: "PPIACO", label: "Producer Price Index", yAxisLabel: "Index", color: "#ff9f1c" },
      { id: "IR", label: "Import Price Index", yAxisLabel: "Index", color: "#2b9348" },
      { id: "EXPGSC1", label: "Exports of Goods & Services", yAxisLabel: "Billions USD", color: "#9d4edd" },
      { id: "IMPGSC1", label: "Imports of Goods & Services", yAxisLabel: "Billions USD", color: "#e36414" },
    ],
  },
  {
  marketName: "Indian Markets",
  series: [
    { id: "INDCPIALLMINMEI", label: "India CPI (Monthly)", yAxisLabel: "Index (2015=100)", color: "#ff7300" },
    { id: "INDCPIALLQINMEI", label: "India CPI (Quarterly)", yAxisLabel: "Index (2015=100)", color: "#e63946" },
    { id: "SPASTT01INM661N", label: "India Share Prices", yAxisLabel: "Index (2015=100)", color: "#0088fe" },
    { id: "RBINBIS", label: "Real Broad Effective Exchange Rate", yAxisLabel: "Index", color: "#2a9d8f" },
    { id: "QINR628BIS", label: "Residential Property Prices", yAxisLabel: "Index (2010=100)", color: "#a83279" },
    { id: "INDGDPRQPSMEI", label: "India GDP (Constant Prices)", yAxisLabel: "Billion INR (constant)", color: "#264653" },
    { id: "DEXINUS", label: "USD to INR Exchange Rate", yAxisLabel: "INR per USD", color: "#e76f51" },
    { id: "INTDSRINM193N", label: "India Central Bank Discount Rate", yAxisLabel: "%", color: "#457b9d" },
    { id: "WPIATT01INQ661N", label: "India WPI", yAxisLabel: "Index (2015=100)", color: "#ff9900" },
  ],
},
];