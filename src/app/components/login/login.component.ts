import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GlobalErrorHandler } from 'src/app/core/services/error-handler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
        .subscribe(status => {
          this.router.navigate(["/homepage"])
        },
          err => this.handleError(err)
        );
    }
  }

  private handleError(err) {
    this.reset(true);
    console.log("%%%%%%%%%%%%%%%%%",err)
    if (err.error.message) {
      this.errMessage = err.error.message;
    } else {
      this.errMessage = this.error.getErrorMessage(100);
    }
  }

  private reset(status) {
    this.errMessage = "";
    this.loading = !status;
    status ? this.login.enable() : this.login.disable();
  }

  ngOnInit(): void {
  }

}
