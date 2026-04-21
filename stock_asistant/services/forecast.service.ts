import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ForecastModel } from "../models/forecast.model";
import { AiIntegrationService } from "./ai-integration.service";

@Injectable({
  providedIn: "root"
})
export class ForecastService {
  private readonly endpoint = "/api/ai/forecasts";

  constructor(private aiIntegrationService: AiIntegrationService) {
  }

  getForecasts(): Observable<ForecastModel[]> {
    return this.aiIntegrationService.getProducts().pipe(
      map((products) => products.map((product, index) => {
        const predictedDemand = Math.max(1, Math.round(product.quantity * 0.6));
        const confidence = product.quantity <= 10 ? 90 : 75;

        return {
          id: index + 1,
          productId: product.publicId,
          productName: product.name,
          stationName: "Main stock",
          currentStock: product.quantity,
          predictedDemand,
          forecastPeriod: "7 days",
          periodLabel: "7 days",
          confidenceScore: confidence,
          confidence,
          trend: product.quantity <= 10 ? "up" : "stable"
        } as ForecastModel;
      }))
    );
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}

