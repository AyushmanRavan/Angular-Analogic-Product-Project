import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { MaterialModule } from '../material/material.module';
import { AuthGuard } from './services/auth/auth-guard.service';
import { NotificationService } from './services/notification.service';
import { GlobalErrorHandler } from './services/error-handler';
import { AuthService } from './services/auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ToolbarComponent, ChangePasswordDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SpinnerModule ,
    FormsModule,
    ReactiveFormsModule
  ],
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
