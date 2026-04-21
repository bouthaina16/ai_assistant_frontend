import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSucess$ = new Subject<string>();
  private toastFail$ = new Subject<string>();

  getToastSucess() {
    return this.toastSucess$.asObservable();
  }

  getToastFail() {
    return this.toastFail$.asObservable();
  }

  showSucess(message: string) {
    this.toastSucess$.next(message);
  }

  showFail(message: string) {
    this.toastFail$.next(message);
  }
}
