import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {Observable, Subject, Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {catchError, debounceTime, distinctUntilChanged, map, tap} from "rxjs/operators";
import {FormsModule} from "@angular/forms";
import {ToastService} from "../../shared/toast/toast.service";
import {RemoveComponent} from "../shared/remove/remove.component";
import {PaginationComponent} from "../shared/pagination/pagination.component";
import {PlaceholderComponent} from "../shared/placeholder/placeholder.component";
import {ClientService} from "../../service/client.service";
import {ClientModel, ClientRequest, ClientResponse, SearchClientModel} from "./client.model";
import {ClientCreateComponent} from "./creation/client-create.component";
import {ClientUpdateComponent} from "./update/client-update.component";
import {ClientOrderComponent} from "./order/client-order.component";

@Component({
  selector: 'app-client',
  imports: [RouterModule, CommonModule, FormsModule, PaginationComponent, PlaceholderComponent, ClientCreateComponent, ClientUpdateComponent, RemoveComponent, ClientOrderComponent],
  standalone: true,
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {

  constructor(private clientService: ClientService, private toastService: ToastService) {
  }
  search: string = "";
  searchSubject = new Subject<string>();
  searchSubscription = new Subscription();
  clients: Observable<ClientModel[]> = this.findClients();
  clientCount: number = 0;
  isLoading = true;
  publicId = '';
  reference = '';
  createDraftSubscription = new Subscription();

  @ViewChild(ClientUpdateComponent) clientupdate?: ClientUpdateComponent;
  @ViewChild(ClientOrderComponent) clientOrder?: ClientOrderComponent;
  @ViewChild(RemoveComponent) removeComponent?: RemoveComponent;
  @ViewChild(PaginationComponent) pagination?: PaginationComponent;

  ngOnInit(): void {
    this.listenToSearch();
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.createDraftSubscription.unsubscribe();
  }

  private findClients(search?: string, page: number = 0): Observable<ClientModel[]> {
    this.isLoading = true;
    const searchRequest = {
      name: search,
      page: page
    } as SearchClientModel;
    return this.clientService.findClients(searchRequest).pipe(
      tap((clients: ClientResponse) => {
        this.clientCount = clients.count;
        this.isLoading = false;
      }),
      map(clientResponse => clientResponse.clients)
    )
  }

  createClient(clientForm: ClientRequest) {
    clientForm.publicId = this.publicId;
    this.clientService.createClient(clientForm)
      .pipe(
        tap((response: ClientModel) => {
          this.toastService.showSucess(`Client <${response.name}> créé avec succées`);
          this.search = "";
          this.clients = this.findClients();
          this.pagination?.init();
          this.createDraftSubscription.unsubscribe();
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la création du client');
          return new Observable();
        })
      )
      .subscribe()
  }

  updateClient(clientRequest: ClientRequest) {
    this.clientService.updateClient(clientRequest)
      .pipe(
        tap((response: ClientModel) => {
          this.toastService.showSucess(`Client <${response.name}> modifié avec succées`);
          this.clients = this.findClients(this.search);
        }),
        catchError(() => {
          this.toastService.showFail('Problème survenu lors de la modification du client');
          return new Observable();
        })
      )
      .subscribe()
  }

  deleteClient(client: ClientRequest) {
    this.clientService.removeClient(client.publicId)
      .pipe(
        tap((response: ClientModel) => {
          this.toastService.showSucess(`Client <${client?.name}> supprimé avec succées`);
          this.search = "";
          this.clients = this.findClients(this.search);
        }),
        catchError((errror) => {
          this.toastService.showFail('Problème survenu lors de la suppression du client');
          return new Observable();
        })
      )
      .subscribe()
  }

  private listenToSearch() {
    this.searchSubscription = this.searchSubject.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((searchQuery: string) => {
        this.clients = this.findClients(searchQuery);
        this.pagination?.init();
      })
    ).subscribe()
  }

  changePage(page: number) {
    this.clients = this.findClients(this.search, page - 1);
  }

  openClientOrders(client: ClientModel): void {
    this.clientOrder?.openForClient(client);
  }

  refreshClientList(): void {
    this.clients = this.findClients(this.search);
  }


  createDraftClient() {
    this.createDraftSubscription = this.clientService.createDraftClient()
      .subscribe(clientModel => {
        this.publicId = clientModel?.publicId;
        this.reference = clientModel?.reference;
      })
  }
}
