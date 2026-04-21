export type KpiTrendDirection = "up" | "down" | "stable";

export interface KpiTrend {
  direction: KpiTrendDirection;
  value: number;
  label: string;
}

export interface KpiModel {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  description: string;
  icon: string;
  variant: "primary" | "success" | "warning" | "danger" | "info";
  trend?: KpiTrend;
}

export type Kpi = KpiModel;
