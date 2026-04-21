import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {AlertModel} from "../../models/alert.model";

@Component({
  selector: "app-alert-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./alert-list.component.html"
})
export class AlertListComponent {

  @Input() alerts: AlertModel[] = [];

  getSeverityClass(severity: string): string {
    switch (severity) {
      case "critical":
        return "ai-badge ai-badge-critical";
      case "high":
        return "ai-badge ai-badge-danger";
      case "medium":
        return "ai-badge ai-badge-warning";
      default:
        return "ai-badge ai-badge-info";
    }
  }

  getTypeLabel(type: string | undefined): string {
    switch (type) {
      case "stockout":
        return "Rupture";
      case "overstock":
        return "Surstock";
      default:
        return "Anomalie";
    }
  }

  trackByAlert(index: number, alert: AlertModel): string {
    return String(alert.id);
  }
}
