import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { AlertModel } from "../models/alert.model";
import { AiIntegrationService } from "./ai-integration.service";

@Injectable({
  providedIn: "root"
})
export class AnomalyService {
  private readonly endpoint = "/api/ai/alerts";

  constructor(private aiIntegrationService: AiIntegrationService) {
  }

  getAlerts(): Observable<AlertModel[]> {
    return this.aiIntegrationService.getProducts().pipe(
      map((products) => products
        .filter((product) => product.quantity <= 10 || product.quantity >= 100)
        .map((product, index) => {
          const isLow = product.quantity <= 10;
          return {
            id: index + 1,
            productId: product.publicId,
            productName: product.name,
            alertType: isLow ? "STOCKOUT" : "OVERSTOCK",
            type: isLow ? "stockout" : "overstock",
            severity: isLow ? "HIGH" : "MEDIUM",
            description: isLow
              ? `Risk of stockout for ${product.name} (stock: ${product.quantity}).`
              : `Potential overstock for ${product.name} (stock: ${product.quantity}).`,
            message: isLow
              ? `Risk of stockout for ${product.name} (stock: ${product.quantity}).`
              : `Potential overstock for ${product.name} (stock: ${product.quantity}).`,
            createdAt: new Date().toISOString(),
            detectedAt: new Date().toISOString(),
            currentStock: product.quantity,
            threshold: isLow ? 10 : 100
          } as AlertModel;
        })
      )
    );
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

