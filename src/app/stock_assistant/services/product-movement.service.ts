import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AI_ASSISTANT_HOST } from "../../../environments/environment";
import { ProductMovementModel } from "../models/product-movement.model";

@Injectable({
  providedIn: "root"
})
export class ProductMovementService {
  private readonly baseUrl = `${AI_ASSISTANT_HOST}/api/stock-movements`;

  constructor(private http: HttpClient) {
  }

  getAllMovements(): Observable<ProductMovementModel[]> {
    return this.http.get<ProductMovementModel[]>(this.baseUrl);
  }
}

