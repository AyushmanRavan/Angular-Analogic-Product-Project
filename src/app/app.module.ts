import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { StorageServiceService } from './core/services/auth/storage-service.service';
import { RestService } from './core/services/rest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationService } from './configuration/configuration.service';
import { UserDialogComponent } from './configuration/user/dialog/dialog.component';
import { TokenInterceptor } from './core/services/auth/token.interceptor';
import { SummaryTableComponent } from './new-pdf/summary-table/summary-table.component';
import { PlantDetailsComponent } from './new-pdf/plant-details/plant-details.component';
import { MonitoringDetailsComponent } from './new-pdf/monitoring-details/monitoring-details.component';
import { AutoLogoutService } from './auto-logout.service';
import { NewPdfComponent } from './new-pdf/new-pdf.component';
import { PipesModule } from './shared/pipes/pipe.module';


@NgModule({
  declarations: [AppComponent, NewPdfComponent, UserDialogComponent,
    MonitoringDetailsComponent, PlantDetailsComponent, SummaryTableComponent],
  imports: [
    AppRoutingModule,
    PDFExportModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule.forRoot(),
    FormsModule,
    HttpClientModule,
    MaterialModule,
    SpinnerModule,
    ReactiveFormsModule,
    PipesModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    RestService, AutoLogoutService,
    ConfigurationService, StorageServiceService
  ],
  entryComponents: [NewPdfComponent, UserDialogComponent]
})
export class AppModule { }
