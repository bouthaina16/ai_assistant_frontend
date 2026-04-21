import { Injectable } from "@angular/core";
import { Observable, combineLatest, map } from "rxjs";
import { AlertModel } from "../models/alert.model";
import { ProductMovementService } from "./product-movement.service";
import { AiIntegrationService } from "./ai-integration.service";

@Injectable({
  providedIn: "root"
})
export class AnomalyService {
  private readonly endpoint = "/api/ai/alerts";

  constructor(
    private productMovementService: ProductMovementService,
    private aiIntegrationService: AiIntegrationService
  ) {
  }

  getAlerts(): Observable<AlertModel[]> {
    return combineLatest([
      this.aiIntegrationService.getProducts(),
      this.productMovementService.getAllMovements()
    ]).pipe(
      map(([products, movements]) => {
        const latestMovementByProduct = new Map<string, number>();

        for (const movement of movements) {
          if (!latestMovementByProduct.has(movement.productPublicId)) {
            latestMovementByProduct.set(movement.productPublicId, movement.newStock);
          }
        }

        return products
          .map((product) => {
            const currentStock = latestMovementByProduct.get(product.publicId) ?? product.quantity ?? 0;
            const isLow = currentStock <= 10;
            const isHigh = currentStock >= 100;

            if (!isLow && !isHigh) {
              return null;
            }

            return {
              id: product.publicId,
              productId: product.publicId,
              productName: product.name,
              alertType: isLow ? "STOCKOUT" : "OVERSTOCK",
              type: isLow ? "stockout" : "overstock",
              severity: isLow ? "HIGH" : "MEDIUM",
              description: isLow
                ? `Risk of stockout for ${product.name} (stock: ${currentStock}).`
                : `Potential overstock for ${product.name} (stock: ${currentStock}).`,
              message: isLow
                ? `Risk of stockout for ${product.name} (stock: ${currentStock}).`
                : `Potential overstock for ${product.name} (stock: ${currentStock}).`,
              createdAt: new Date().toISOString(),
              detectedAt: new Date().toISOString(),
              currentStock,
              threshold: isLow ? 10 : 100
            } as AlertModel;
          })
          .filter((alert): alert is AlertModel => alert !== null);
      })
    );
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

