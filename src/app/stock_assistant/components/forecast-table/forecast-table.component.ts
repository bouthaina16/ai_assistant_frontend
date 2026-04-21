import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {ForecastModel} from "../../models/forecast.model";

@Component({
  selector: "app-forecast-table",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./forecast-table.component.html"
})
export class ForecastTableComponent {

  @Input() forecasts: ForecastModel[] = [];

  getConfidenceClass(confidence: number | undefined): string {
    if (confidence === undefined) {
      return "text-muted";
    }
    if (confidence >= 85) {
      return "text-success";
    }

    if (confidence >= 70) {
      return "text-warning";
    }

    return "text-danger";
  }

  trackByForecast(index: number, forecast: ForecastModel): string {
    return String(forecast.id ?? index);
  }
}
