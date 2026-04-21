export interface Forecast {
  productId: number;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  forecastPeriod: string;
  confidenceScore?: number;
}

