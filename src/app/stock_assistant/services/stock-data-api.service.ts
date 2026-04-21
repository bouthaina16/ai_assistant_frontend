import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap, throwError } from "rxjs";
import { HOST } from "../../../environments/environment";

export interface StockProductModel {
  publicId: string;
  name: string;
  quantity: number;
  unit: string;
  type: "RAW" | "FINAL" | string;
  reference: string;
}

export interface StockClientModel {
  publicId: string;
  name: string;
  reference: string;
  address: string;
  email: string;
  fiscalId: string;
  tel: string;
}

export interface StockInvoiceModel {
  publicId: string;
  reference: string;
  productInvoices: Array<{
    productPublicId: string;
    quantity: number;
  }>;
}

interface ProductSearchResponse {
  products: StockProductModel[];
  count: number;
}

interface ClientSearchResponse {
  clients: StockClientModel[];
  count: number;
}

interface InvoiceSearchResponse {
  invoices: StockInvoiceModel[];
  count: number;
}

interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: "root"
})
export class StockDataApiService {
  private readonly baseUrl = `${HOST}/api/stok`;
  private readonly authUrl = `${HOST}/api/stok/auth/login`;
  private readonly login = "stockroot";
  private readonly password = "Root@123";

  private token: string | null = localStorage.getItem("Authorization");
  private authInFlight$: Observable<string> | null = null;

  public hasToken(): boolean {
    return !!this.token;
  }

  constructor(private readonly http: HttpClient) {
  }

  private ensureToken(): Observable<string> {
    if (this.token) {
      return of(this.token);
    }

    if (this.authInFlight$) {
      return this.authInFlight$;
    }

    this.authInFlight$ = this.http.post<LoginResponse>(this.authUrl, {
      login: this.login,
      password: this.password
    }).pipe(
      map((response) => response.accessToken),
      tap((token) => {
        this.token = token;
        localStorage.setItem("Authorization", token);
      }),
      finalize(() => {
        this.authInFlight$ = null;
      }),
      shareReplay(1)
    );

    return this.authInFlight$;
  }

  private authHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private withAuthRetry<T>(requestFactory: (token: string) => Observable<T>): Observable<T> {
    return this.ensureToken().pipe(
      switchMap((token) => requestFactory(token)),
      catchError((error) => {
        const status = error?.status;
        if (status === 401 || status === 403) {
          this.token = null;
          localStorage.removeItem("Authorization");
          return this.ensureToken().pipe(
            switchMap((newToken) => requestFactory(newToken))
          );
        }

        return throwError(() => error);
      })
    );
  }

  searchProducts(type: "RAW" | "FINAL"): Observable<ProductSearchResponse> {
    return this.withAuthRetry((token) => this.http.post<ProductSearchResponse>(`${this.baseUrl}/product/search`, {
        types: [type],
        page: 0,
        pageSize: 200
      }, {
        headers: this.authHeaders(token)
      }));
  }

  searchClients(): Observable<ClientSearchResponse> {
    return this.withAuthRetry((token) => this.http.post<ClientSearchResponse>(`${this.baseUrl}/client/search`, {
        page: 0,
        pageSize: 200
      }, {
        headers: this.authHeaders(token)
      }));
  }

  searchInvoices(): Observable<InvoiceSearchResponse> {
    return this.withAuthRetry((token) => this.http.post<InvoiceSearchResponse>(`${this.baseUrl}/invoice/search`, {
        page: 0,
        pageSize: 200
      }, {
        headers: this.authHeaders(token)
      }));
  }
}

