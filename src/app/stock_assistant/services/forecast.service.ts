import { Injectable } from "@angular/core";
import { Observable, combineLatest, map } from "rxjs";
import { ForecastModel } from "../models/forecast.model";
import { AiIntegrationService } from "./ai-integration.service";
import { ProductMovementService } from "./product-movement.service";

@Injectable({
  providedIn: "root"
})
export class ForecastService {
  private readonly endpoint = "/api/ai/forecasts";

  constructor(
    private aiIntegrationService: AiIntegrationService,
    private productMovementService: ProductMovementService
  ) {
  }

  getForecasts(): Observable<ForecastModel[]> {
    return combineLatest([
      this.aiIntegrationService.getProducts(),
      this.aiIntegrationService.getOrders(),
      this.productMovementService.getAllMovements()
    ]).pipe(
      map(([products, orders, movements]) => {
        const latestMovementByProduct = new Map<string, number>();
        for (const movement of movements) {
          if (!latestMovementByProduct.has(movement.productPublicId)) {
            latestMovementByProduct.set(movement.productPublicId, movement.newStock);
          }
        }

        const today = new Date().toISOString().slice(0, 10);
        const orderDemandByProduct = new Map<string, number>();

        for (const invoice of orders) {
          for (const productInvoice of invoice.productInvoices ?? []) {
            const productId = productInvoice.productPublicId;
            const quantity = productInvoice.quantity ?? 0;

            if (!productId || quantity <= 0) {
              continue;
            }

            orderDemandByProduct.set(productId, (orderDemandByProduct.get(productId) ?? 0) + quantity);
          }
        }

        return products
          .filter((product) => !!product.name)
          .map((product, index) => {
            const currentStock = latestMovementByProduct.get(product.publicId) ?? product.quantity ?? 0;
            const ordersDemand = orderDemandByProduct.get(product.publicId) ?? 0;
            const baselineDemand = Math.max(1, Math.round(currentStock * 0.45));
            const predictedDemand = Math.max(baselineDemand, ordersDemand);

            const confidence = ordersDemand > 0 ? 88 : 74;
            let trend: ForecastModel["trend"] = "stable";
            if (predictedDemand > currentStock) {
              trend = "up";
            } else if (predictedDemand < currentStock * 0.4) {
              trend = "down";
            }

            return {
              id: index + 1,
              productId: product.publicId,
              productName: product.name,
              stationName: "GLOBAL",
              currentStock,
              predictedDemand,
              forecastPeriod: "7 days",
              periodLabel: "7 days",
              confidenceScore: confidence,
              confidence,
              trend,
              generatedAt: new Date().toISOString(),
              period: {
                startDate: today,
                endDate: today,
                label: "Next 7 days"
              }
            } as ForecastModel;
          });
      })
    );
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

