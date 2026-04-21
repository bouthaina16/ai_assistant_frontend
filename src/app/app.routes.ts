import { Routes } from '@angular/router';
import { AiAssistantShellComponent } from "./stock_assistant/ai-assistant-shell.component";
import { AiDashboardComponent } from "./stock_assistant/pages/dashboard/ai-dashboard.component";
import { AiRecommendationsComponent } from "./stock_assistant/pages/recommendations/ai-recommendations.component";
import { AiForecastsComponent } from "./stock_assistant/pages/forecasts/ai-forecasts.component";
import { AiAlertsComponent } from "./stock_assistant/pages/alerts/ai-alerts.component";

export const routes: Routes = [
  {
    path: "",
    component: AiAssistantShellComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
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
      },
    ]
  }
];
