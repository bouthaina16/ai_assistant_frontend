export interface InventoryAlert {
  id: number;
  productId: number;
  productName: string;
  alertType: "STOCKOUT" | "OVERSTOCK" | "ANOMALY";
  severity: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  createdAt: string;
}

