import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {
  ProductModel,
  ProductRequest,
  ProductResponse,
  ProductType,
  SearchProductModel
} from "../home/product/product.model";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {
  BASE_URL,
  PRODUCT,
  LOGIN,
  PRODUCT_SEARCH_BY_TYPE,
  ADD,
  SUBTRACT,
  PRODUCT_SEARCH,
  DRAFT
} from "../utils/url.constants";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  createDraftProduct(): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}${DRAFT}`, {})
  }

  createProduct(product: ProductRequest): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}`, product)
  }

  updateProduct(product: ProductRequest): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}`, product)
  }

  removeProduct(publicId: string): Observable<any> {
    return this.http.delete(`${HOST}${BASE_URL}${PRODUCT}/${publicId}`);
  }

  addQuantity(publicId: string, quantity: number): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}${ADD}${publicId}`, quantity);
  }

  subtractQuantity(publicId: string, quantity: number): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${HOST}${BASE_URL}${PRODUCT}${SUBTRACT}${publicId}`, quantity);
  }

  findAllProducts(search: SearchProductModel): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${HOST}${BASE_URL}${PRODUCT_SEARCH}`, search)
  }
}
