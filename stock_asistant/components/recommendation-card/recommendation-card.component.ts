import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {RecommendationModel} from "../../models/recommendation.model";

@Component({
  selector: "app-recommendation-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./recommendation-card.component.html"
})
export class RecommendationCardComponent {

  @Input() recommendation!: RecommendationModel;

  getActionClass(): string {
    switch (this.recommendation?.actionType) {
      case "restock":
        return "ai-badge ai-badge-success";
      case "reduce-stock":
        return "ai-badge ai-badge-warning";
      default:
        return "ai-badge ai-badge-info";
    }
  }

  getActionLabel(): string {
    switch (this.recommendation?.actionType) {
      case "restock":
        return "Réapprovisionner";
      case "reduce-stock":
        return "Réduire le stock";
      default:
        return "Surveiller";
    }
  }

  getPriorityClass(): string {
    switch (this.recommendation?.priority) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      default:
        return "text-success";
    }
  }
}