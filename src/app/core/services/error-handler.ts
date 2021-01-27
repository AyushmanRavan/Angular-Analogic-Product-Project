import { ErrorHandler, Injectable, Inject } from "@angular/core";
import { has } from "lodash";

import { AuthService } from "./auth/auth.service";
import { NotificationService } from "../../core/services/notification.service";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private alert: NotificationService, private auth: AuthService) {
    super();
  }

  handleError(error: any) {
    super.handleError(error);
    let msg = ERR.COMMON_ERR;

    if (has(error, "status") && error.status === 401) {
      this.alert.notify(this.getErrorMessage(401), "Okay", 5000);
      this.auth.logout();
      return;
    }

    if (has(error, "status") && error.status === 409) {
      this.alert.notify(this.getErrorMessage(409), "Okay", 5000);
    }

  }

  getErrorMessage = errorId => {
    let msg = ERR.COMMON_ERR,
      id = errorId;
    switch (id) {
      case 1:
        msg = ERR.NO_DATA;
        break;

      case 2:
        msg = ERR.INVALID_CREDENTIALS;
        break;

      case 3:
      case "POPUP_BLOCK":
        msg = ERR.POPUP_BLOCK;
        break;

      case 401:
        msg = ERR.UNAUTHORIZED;
        break;

      case 409:
        msg = ERR.UNIQUE;
        break;

      case 12:
        msg = ERR.UNIQUE;
        break;

      case 0:

      default:
        msg = ERR.COMMON_ERR;
        break;

    }
    return msg;
  };
}

const ERR = {
  COMMON_ERR: "Oops something went wrong, please try again.",
  NO_DATA: "No data found.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  POPUP_BLOCK:
    "It seems your browser has blocked the popup. Please disable blocking it to download excel.",
  UNAUTHORIZED: "You are not authorized or your session is expired.",
  UNIQUE: "Unable to create.already exist.",
  SERVER_DOWN: "Oops, something went wrong. Server is down"
};
