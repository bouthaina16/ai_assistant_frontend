export type RecommendationType = "RESTOCK" | "REDUCE_STOCK" | "MONITOR" | "restock" | "reduce-stock" | "monitor";
export type RecommendationPriority = "LOW" | "MEDIUM" | "HIGH" | "low" | "medium" | "high";

export interface Recommendation {
  id: number | string;
  productId: number | string;
  productName: string;
  type?: RecommendationType;
  message?: string;
  priority?: RecommendationPriority;
  suggestedQuantity?: number;
  createdAt?: string;
  confidenceScore?: number;
  // Legacy/extended fields kept optional for UI evolution
  title?: string;
  stationName?: string;
  category?: string;
  actionType?: RecommendationType;
  description?: string;
  reason?: string;
  currentStock?: number;
  optimalStock?: number;
  priorityScore?: number;
  estimatedSavings?: number;
  tags?: string[];
  impact?: string | { metric: string; value: number; unit?: string; direction?: string };
  confidence?: number;
  generatedAt?: string;
  targetStock?: number;
}

export type RecommendationModel = Recommendation;
