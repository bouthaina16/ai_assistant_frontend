import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {KpiModel} from "../../models/kpi.model";

@Component({
  selector: "app-kpi-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./kpi-card.component.html"
})
export class KpiCardComponent {

  @Input() kpi!: KpiModel;

  getTrendClass(): string {
    if (!this.kpi?.trend) {
      return "text-muted";
    }

    return this.kpi.trend.value >= 0 ? "text-success" : "text-danger";
  }

  getTrendIcon(): string {
    if (!this.kpi?.trend) {
      return "bi bi-dash";
    }

    return this.kpi.trend.value >= 0 ? "bi bi-arrow-up-right" : "bi bi-arrow-down-right";
  }
}
