import { Injectable } from "@angular/core";
import { Observable, combineLatest, delay, map, of } from "rxjs";
import { KpiModel } from "../models/kpi.model";
import { RecommendationService } from "./recommendation.service";
import { ForecastService } from "./forecast.service";
import { AnomalyService } from "./anomaly.service";
import { AiIntegrationService } from "./ai-integration.service";

export interface DashboardSummary {
  kpis: KpiModel[];
  alertCount: number;
  recommendationCount: number;
  topRecommendations: unknown[];
}

@Injectable({
  providedIn: "root"
})
export class AiAssistantService {
  private readonly analyzeEndpoint = "/api/ai/analyze";

  constructor(
    private recommendationService: RecommendationService,
    private forecastService: ForecastService,
    private anomalyService: AnomalyService,
    private aiIntegrationService: AiIntegrationService
  ) {
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return combineLatest([
      this.recommendationService.getRecommendations(),
      this.forecastService.getForecasts(),
      this.anomalyService.getAlerts(),
      this.aiIntegrationService.getClients(),
      this.aiIntegrationService.getOrders()
    ]).pipe(
      map(([recommendations, forecasts, alerts, clients, orders]) => {
        const criticalStockCount = alerts.filter((alert) => String(alert.alertType).toUpperCase() === "STOCKOUT").length;
        const overstockCount = alerts.filter((alert) => String(alert.alertType).toUpperCase() === "OVERSTOCK").length;
        const highDemandCount = forecasts.filter((forecast) => forecast.predictedDemand > forecast.currentStock).length;

        const kpis: KpiModel[] = [
          {
            id: "critical-stock",
            label: "Critical stock",
            value: criticalStockCount,
            displayValue: String(criticalStockCount),
            description: "Products with stockout risk",
            icon: "bi bi-exclamation-triangle",
            variant: "danger",
            trend: { direction: "up", value: criticalStockCount, label: "live" }
          },
          {
            id: "overstock",
            label: "Overstock",
            value: overstockCount,
            displayValue: String(overstockCount),
            description: "Products above high threshold",
            icon: "bi bi-boxes",
            variant: "warning",
            trend: { direction: "stable", value: overstockCount, label: "live" }
          },
          {
            id: "high-turnover",
            label: "High turnover risk",
            value: highDemandCount,
            displayValue: String(highDemandCount),
            description: "Demand likely above current stock",
            icon: "bi bi-graph-up-arrow",
            variant: "info",
            trend: { direction: "up", value: highDemandCount, label: "7d" }
          },
          {
            id: "recommendations",
            label: "Recommendations",
            value: recommendations.length,
            displayValue: String(recommendations.length),
            description: "Actions generated from real products",
            icon: "bi bi-stars",
            variant: "success",
            trend: { direction: "stable", value: recommendations.length, label: "live" }
          },
          {
            id: "clients",
            label: "Clients",
            value: clients.length,
            displayValue: String(clients.length),
            description: "Registered active clients",
            icon: "bi bi-people",
            variant: "info",
            trend: { direction: "stable", value: clients.length, label: "live" }
          },
          {
            id: "orders",
            label: "Client orders",
            value: orders.length,
            displayValue: String(orders.length),
            description: "Completed orders (invoices)",
            icon: "bi bi-cart-check",
            variant: "primary",
            trend: { direction: "up", value: orders.length, label: "live" }
          }
        ];

        return {
          kpis,
          alertCount: alerts.length,
          recommendationCount: recommendations.length,
          topRecommendations: recommendations.slice(0, 3)
        };
      }),
      delay(120)
    );
  }

  refreshAnalysis(): Observable<{ status: "accepted"; endpoint: string }> {
    // Future backend call: this.http.post('/api/ai/analyze', {})
    return of({ status: "accepted" as const, endpoint: this.analyzeEndpoint }).pipe(delay(120));
  }
}

