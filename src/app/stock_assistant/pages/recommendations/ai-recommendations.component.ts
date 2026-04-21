import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RecommendationCardComponent } from "../../components/recommendation-card/recommendation-card.component";
import { Recommendation } from "../../models/recommendation.model";
import { RecommendationService } from "../../services/recommendation.service";

@Component({
  selector: "app-ai-recommendations",
  standalone: true,
  imports: [CommonModule, RecommendationCardComponent],
  templateUrl: "./ai-recommendations.component.html"
})
export class AiRecommendationsComponent implements OnInit {
  isLoading = true;
  recommendations: Recommendation[] = [];

  constructor(private recommendationService: RecommendationService) {
  }

  ngOnInit(): void {
    this.recommendationService.getRecommendations().subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}