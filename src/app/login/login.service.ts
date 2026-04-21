import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BASE_URL, LOGIN, USER, CHECK} from "../utils/url.constants";
import {HOST} from "../../environments/environment";
import {Observable} from "rxjs";
import {LoginRequest} from "./model/login-request.model";
import {LoginResponseModel} from "./model/login-response.model";
import {TokenResponseModel} from "./model/token-response.model";
import {catchError, filter, tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  createUser(loginRequest: LoginRequest): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${HOST}${BASE_URL}${USER}`, loginRequest)
  }

  loginUser(loginRequest: LoginRequest): Observable<TokenResponseModel> {
    return this.http.post<TokenResponseModel>(`${HOST}${BASE_URL}${LOGIN}`, loginRequest)
  }

  checkToken(): void {
    const token = localStorage.getItem('Authorization');
    if (token) {
      this.http.post<boolean>(`${HOST}${BASE_URL}${CHECK}`, token)
        .pipe(
          filter(isValid => !isValid),
          tap(() => this.cleanStorage()),
          catchError(() => {
            this.cleanStorage();
            return new Observable();
          })
        ).subscribe();
    }
  }

  private cleanStorage() {
    localStorage.removeItem('Authorization');
    this.router.navigate(["login"]);
  }
}
