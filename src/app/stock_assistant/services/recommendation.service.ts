import { Injectable } from "@angular/core";
import { Observable, combineLatest, map } from "rxjs";
import { RecommendationModel } from "../models/recommendation.model";
import { ProductMovementService } from "./product-movement.service";
import { AiIntegrationService } from "./ai-integration.service";

@Injectable({
  providedIn: "root"
})
export class RecommendationService {
  private readonly endpoint = "/api/ai/recommendations";

  constructor(
    private productMovementService: ProductMovementService,
    private aiIntegrationService: AiIntegrationService
  ) {
  }

  getRecommendations(): Observable<RecommendationModel[]> {
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
          .filter((product) => !!product.name)
          .map((product, index) => {
            const currentStock = latestMovementByProduct.get(product.publicId) ?? product.quantity ?? 0;
            const lowStock = currentStock <= 10;
            const overStock = currentStock >= 100;

            let type: RecommendationModel["type"] = "MONITOR";
            let actionType: RecommendationModel["actionType"] = "monitor";
            let priority: RecommendationModel["priority"] = "LOW";
            let confidence = 76;
            let message = `Monitor stock trend for ${product.name}; current stock is ${currentStock}.`;

            if (lowStock) {
              type = "RESTOCK";
              actionType = "restock";
              priority = "HIGH";
              confidence = 92;
              message = `Reorder ${product.name}; stock is critically low (${currentStock}).`;
            } else if (overStock) {
              type = "REDUCE_STOCK";
              actionType = "reduce-stock";
              priority = "MEDIUM";
              confidence = 84;
              message = `Reduce incoming quantity for ${product.name}; stock is high (${currentStock}).`;
            }

            return {
              id: index + 1,
              productId: product.publicId,
              productName: product.name,
              type,
              priority,
              message,
              suggestedQuantity: lowStock ? Math.max(20, 50 - currentStock) : undefined,
              createdAt: new Date().toISOString(),
              title: message,
              description: message,
              actionType,
              confidenceScore: confidence,
              confidence,
              targetStock: 50,
              currentStock,
              impact: `${currentStock}`
            } as RecommendationModel;
          });
      })
    );
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

