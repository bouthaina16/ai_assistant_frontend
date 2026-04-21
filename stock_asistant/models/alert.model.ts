export type InventoryAlertType = "STOCKOUT" | "OVERSTOCK" | "ANOMALY" | "stockout" | "overstock" | "anomaly";
export type InventoryAlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "low" | "medium" | "high" | "critical";

export interface InventoryAlert {
  id: number | string;
  productId: number | string;
  productName: string;
  alertType?: InventoryAlertType;
  severity: InventoryAlertSeverity;
  description?: string;
  createdAt?: string;
  detectedAt?: string;
  acknowledged?: boolean;
  currentStock?: number;
  threshold?: number;
  // Legacy/extended fields kept optional for UI evolution
  title?: string;
  message?: string;
  stationName?: string;
  type?: InventoryAlertType;
}

export type Alert = InventoryAlert;
export type AlertModel = InventoryAlert;
