import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { RecommendationModel } from "../models/recommendation.model";
import { AiIntegrationService } from "./ai-integration.service";

@Injectable({
  providedIn: "root"
})
export class RecommendationService {
  private readonly endpoint = "/api/ai/recommendations";

  constructor(private aiIntegrationService: AiIntegrationService) {
  }

  getRecommendations(): Observable<RecommendationModel[]> {
    return this.aiIntegrationService.getProducts().pipe(
      map((products) => products
        .filter((product) => !!product.name)
        .map((product, index) => {
          const lowStock = product.quantity <= 10;
          const overStock = product.quantity >= 100;

          let type: RecommendationModel["type"] = "MONITOR";
          let priority: RecommendationModel["priority"] = "LOW";
          let message = `Monitor stock trend for ${product.name}.`;

          if (lowStock) {
            type = "RESTOCK";
            priority = "HIGH";
            message = `Order additional units for ${product.name}; current stock is low (${product.quantity}).`;
          } else if (overStock) {
            type = "REDUCE_STOCK";
            priority = "MEDIUM";
            message = `Reduce incoming quantity for ${product.name}; current stock is high (${product.quantity}).`;
          }

          return {
            id: index + 1,
            productId: product.publicId,
            productName: product.name,
            type,
            priority,
            message,
            suggestedQuantity: lowStock ? Math.max(20, 50 - product.quantity) : undefined,
            createdAt: new Date().toISOString(),
            title: message,
            description: message,
            actionType: type,
            confidenceScore: 80,
            confidence: 0.8,
            targetStock: 50,
            impact: `${product.quantity}`
          } as RecommendationModel;
        })
      )
    );
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

