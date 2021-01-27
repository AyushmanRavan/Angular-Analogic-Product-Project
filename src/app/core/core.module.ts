import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SpinnerModule } from "../components/spinner";
import { MaterialModule } from "../material/material.module";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { AuthService } from "./services/auth/auth.service";
import { AuthGuard } from "./services/auth/auth-guard.service";
import { GlobalErrorHandler } from "./services/error-handler";
import { NotificationService } from "./services/notification.service";
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
// import { ConfigurationService } from '../configuration/configuration.service';
// import { UserDialogComponent} from '../configuration/user/dialog/dialog.component';
@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule, ReactiveFormsModule, SpinnerModule],
  declarations: [ToolbarComponent, ChangePasswordDialogComponent],
  exports: [ToolbarComponent],
  providers: [
    AuthGuard,
    AuthService,
    GlobalErrorHandler,
    NotificationService,
  ],
  entryComponents: [ChangePasswordDialogComponent]
})
export class CoreModule {
  static forRoot() {
    return { ngModule: CoreModule };
  }
}
