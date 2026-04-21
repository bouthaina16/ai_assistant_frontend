import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ForecastTableComponent } from "../../components/forecast-table/forecast-table.component";
import { Forecast } from "../../models/forecast.model";
import { ForecastService } from "../../services/forecast.service";

@Component({
  selector: "app-ai-forecasts",
  standalone: true,
  imports: [CommonModule, ForecastTableComponent],
  templateUrl: "./ai-forecasts.component.html"
})
export class AiForecastsComponent implements OnInit {
  isLoading = true;
  forecasts: Forecast[] = [];

  constructor(private forecastService: ForecastService) {
  }

  ngOnInit(): void {
    this.forecastService.getForecasts().subscribe({
      next: (forecasts) => {
        this.forecasts = forecasts;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}