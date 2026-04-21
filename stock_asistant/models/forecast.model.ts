export interface Forecast {
  productId: number | string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  forecastPeriod?: string;
  confidenceScore?: number;
  // Legacy/extended fields kept optional for UI evolution
  id?: number | string;
  stationName?: string;
  trend?: "up" | "down" | "stable";
  periodLabel?: string;
  confidence?: number;
  category?: string;
  period?: {
    startDate: string;
    endDate: string;
    label: string;
  };
  recommendedStock?: number;
  reorderPoint?: number;
  generatedAt?: string;
}

export type ForecastModel = Forecast;
