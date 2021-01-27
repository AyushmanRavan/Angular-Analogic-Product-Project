import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validator, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GlobalErrorHandler } from "../../core/services/error-handler";
import { AuthService } from "../../core/services/auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {

  login: FormGroup;
  loading: boolean;
  errMessage: string;

  constructor(
    private fb: FormBuilder,
    private user: AuthService,
    private router: Router,
    private error: GlobalErrorHandler
  ) {
    this.login = this.fb.group({
      id: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  onSubmit() {
    if (this.login.valid) {
      this.reset(false);
      const { id, password } = this.login.value;

      this.user
        .login(id, password)
        // .login(id, btoa(password))
        .subscribe(
          status => {
            this.router.navigate(["/homepage"])
          },
          err => this.handleError(err)
        );
    }
  }

  private handleError(err) {
    this.reset(true);
    if (err.error.message) {
      this.errMessage = err.error.message;
    } else {
      this.errMessage = this.error.getErrorMessage(12);
    }
  }

  private reset(status) {
    this.errMessage = "";
    this.loading = !status;
    status ? this.login.enable() : this.login.disable();
  }


}
