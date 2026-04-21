import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {
  BASE_URL,
  BL, BY_BL,
  CLIENT,
  CLIENT_SEARCH,
  CLOSE,
  DRAFT,
  EXPORT,
  INVOICE, INVOICE_BL_SEARCH,
  INVOICE_SEARCH
} from "../utils/url.constants";
import {ClientModel, ClientRequest, ClientResponse, SearchClientModel} from "../home/client/client.model";
import {InvoiceModel, InvoiceRequest, InvoiceResponse, SearchInvoiceModel} from "../home/invoice/invoice.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  createDraftInvoice(): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(`${HOST}${BASE_URL}${INVOICE}${DRAFT}`, {})
  }

  createInvoice(invoice: InvoiceRequest): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(`${HOST}${BASE_URL}${INVOICE}`, invoice)
  }

  closeInvoice(publicId: string): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(`${HOST}${BASE_URL}${INVOICE}${CLOSE}/${publicId}`, {})
  }

  findInvoices(search: SearchInvoiceModel, isBl: boolean): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(`${HOST}${BASE_URL}${isBl ? INVOICE_BL_SEARCH : INVOICE_SEARCH}`, search)
  }

  downloadInvoice(publicId: string) {
    return this.http.get(`${HOST}${BASE_URL}${EXPORT}${INVOICE}/${publicId}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  downloadBl(publicId: string) {
    return this.http.get(`${HOST}${BASE_URL}${EXPORT}${BL}/${publicId}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  createInvoiceByBls(blSelectionFiltered: string[]): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(`${HOST}${BASE_URL}${INVOICE}${BY_BL}`, blSelectionFiltered)
  }
}
