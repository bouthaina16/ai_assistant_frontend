import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService} from "../login.service";
import {LoginRequest} from "../model/login-request.model";
import {TokenResponseModel} from "../model/token-response.model";
import {Router, RouterLink} from "@angular/router";
import {ToastService} from "../../shared/toast/toast.service";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.scss'
})
export class LoginUserComponent {

  public loginUserFormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  loading = false;

  constructor(private loginService: LoginService,  private router: Router, private toastService: ToastService) {
  }

  onSubmit() {
    this.loading = true;
    this.loginService.loginUser({
      login: this.loginUserFormGroup.get('username')?.value,
      password: this.loginUserFormGroup.get('password')?.value,
    } as LoginRequest).subscribe((response: TokenResponseModel) => {
      localStorage.setItem('Authorization', response.accessToken)
      this.loading = false;
      this.loginUserFormGroup.reset();
      this.toastService.showSucess("Vous avez accéder à l'application");
      this.router.navigate(['../']);
      }, err => {
        this.loading = false;
        console.error(err);
      this.toastService.showFail("Vous n'etes pas autorisé à accéder");
      this.loginUserFormGroup.reset();
    })
  }
}
