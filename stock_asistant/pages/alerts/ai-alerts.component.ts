import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AlertListComponent } from "../../components/alert-list/alert-list.component";
import { Alert } from "../../models/alert.model";
import { AnomalyService } from "../../services/anomaly.service";

@Component({
  selector: "app-ai-alerts",
  standalone: true,
  imports: [CommonModule, AlertListComponent],
  templateUrl: "./ai-alerts.component.html"
})
export class AiAlertsComponent implements OnInit {
  isLoading = true;
  alerts: Alert[] = [];

  constructor(private anomalyService: AnomalyService) {
  }

  ngOnInit(): void {
    this.anomalyService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}