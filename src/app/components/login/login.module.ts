import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from "@angular/flex-layout";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login.component";
import { SpinnerModule } from "../spinner/index";
import { CoreModule } from "../../core/core.module";

const MAT_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule
];

const ROUTE = [
  {
    path: "",
    component: LoginComponent
  }
];
 
@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTE),
    SpinnerModule,
    ...MAT_MODULES
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}
