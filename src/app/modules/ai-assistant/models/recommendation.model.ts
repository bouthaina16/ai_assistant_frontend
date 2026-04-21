export interface Recommendation {
  id: number;
  productId: number;
  productName: string;
  type: "RESTOCK" | "REDUCE_STOCK" | "MONITOR";
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  suggestedQuantity?: number;
  createdAt: string;
}

