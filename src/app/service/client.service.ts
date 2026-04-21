import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HOST} from "../../environments/environment";
import {BASE_URL, CLIENT, CLIENT_SEARCH, DRAFT} from "../utils/url.constants";
import {ClientModel, ClientRequest, ClientResponse, SearchClientModel} from "../home/client/client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  createDraftClient(): Observable<ClientModel> {
    return this.http.post<ClientModel>(`${HOST}${BASE_URL}${CLIENT}${DRAFT}`, {})
  }

  createClient(client: ClientRequest): Observable<ClientModel> {
    return this.http.post<ClientModel>(`${HOST}${BASE_URL}${CLIENT}`, client)
  }

  updateClient(client: ClientRequest): Observable<ClientModel> {
    return this.http.put<ClientModel>(`${HOST}${BASE_URL}${CLIENT}`, client)
  }

  removeClient(publicId: string): Observable<any> {
    return this.http.delete(`${HOST}${BASE_URL}${CLIENT}/${publicId}`);
  }

  findClients(search: SearchClientModel): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${HOST}${BASE_URL}${CLIENT_SEARCH}`, search)
  }

}
