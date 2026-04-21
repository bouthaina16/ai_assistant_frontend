import { Routes } from "@angular/router";
import { AiAssistantShellComponent } from "./ai-assistant-shell.component";
import { AiDashboardComponent } from "./pages/dashboard/ai-dashboard.component";
import { AiRecommendationsComponent } from "./pages/recommendations/ai-recommendations.component";
import { AiForecastsComponent } from "./pages/forecasts/ai-forecasts.component";
import { AiAlertsComponent } from "./pages/alerts/ai-alerts.component";

export const aiAssistantRoutes: Routes = [
  {
    path: "",
    component: AiAssistantShellComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        component: AiDashboardComponent
      },
      {
        path: "recommendations",
        component: AiRecommendationsComponent
      },
      {
        path: "forecasts",
        component: AiForecastsComponent
      },
      {
        path: "alerts",
        component: AiAlertsComponent
      }
    ]
  }
];