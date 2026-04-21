import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { KpiCardComponent } from "../../components/kpi-card/kpi-card.component";
import { RecommendationCardComponent } from "../../components/recommendation-card/recommendation-card.component";
import { AlertListComponent } from "../../components/alert-list/alert-list.component";
import { ForecastTableComponent } from "../../components/forecast-table/forecast-table.component";
import { Alert } from "../../models/alert.model";
import { Forecast } from "../../models/forecast.model";
import { Kpi } from "../../models/kpi.model";
import { Recommendation } from "../../models/recommendation.model";
import { AiAssistantService } from "../../services/ai-assistant.service";
import { RecommendationService } from "../../services/recommendation.service";
import { ForecastService } from "../../services/forecast.service";
import { AnomalyService } from "../../services/anomaly.service";

@Component({
  selector: "app-ai-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    RecommendationCardComponent,
    AlertListComponent,
    ForecastTableComponent
  ],
  templateUrl: "./ai-dashboard.component.html"
})
export class AiDashboardComponent implements OnInit {
  isLoading = true;
  summaryText = "";
  kpis: Kpi[] = [];
  recommendations: Recommendation[] = [];
  forecasts: Forecast[] = [];
  alerts: Alert[] = [];

  constructor(
    private aiAssistantService: AiAssistantService,
    private recommendationService: RecommendationService,
    private forecastService: ForecastService,
    private anomalyService: AnomalyService
  ) {
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.aiAssistantService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.kpis = summary.kpis;
        this.summaryText = `AI detected ${summary.alertCount} alerts, generated ${summary.recommendationCount} recommendations, and highlighted ${summary.topRecommendations.length} priority items.`;
      }
    });

    this.recommendationService.getRecommendations().subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations.slice(0, 3);
      }
    });

    this.forecastService.getForecasts().subscribe({
      next: (forecasts) => {
        this.forecasts = forecasts.slice(0, 5);
      }
    });

    this.anomalyService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts.slice(0, 5);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}