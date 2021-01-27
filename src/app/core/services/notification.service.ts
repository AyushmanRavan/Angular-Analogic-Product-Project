import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  notify(message: string, action: string = "", duration = 2000) {
    this._snackBar.open(message, action, {
      duration
    });
  }
}
