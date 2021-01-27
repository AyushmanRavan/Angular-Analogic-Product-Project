import { Injectable } from "@angular/core";
import {
  Menu,
  PMS_CONFIGURATION_MENU_ITEMS,
  PMS_DASHBOARD_MENU_ITEMS,
  PMS_REPORT_MENU_ITEM,
  ROLES
} from "../data";
import { RestApi } from "../core/services/rest.service";
import { DATA } from "../core/data.enum";
import { StorageServiceService } from "../core/services/auth/storage-service.service";
// import { Observable } from "rxjs/Observable";
 
@Injectable()
export class DashboardService {
  constructor(private _rest: RestApi, private storageServiceService: StorageServiceService) {}

  getMenu() {
    let menu: Menu[] = [];

    const role: string = atob(this.storageServiceService.getStorage(DATA.ROLE));

    switch (role) {
      case ROLES.USER:
        menu.push(...PMS_DASHBOARD_MENU_ITEMS,...PMS_REPORT_MENU_ITEM,...PMS_CONFIGURATION_MENU_ITEMS);
        break;

      case ROLES.ADMIN:
        menu.push(
          ...PMS_DASHBOARD_MENU_ITEMS,
          ...PMS_REPORT_MENU_ITEM,
          ...PMS_CONFIGURATION_MENU_ITEMS
        );
        break;

      case ROLES.PARTICIPANT: 
      menu.push(...PMS_DASHBOARD_MENU_ITEMS);
      break;
      
      case ROLES.SUPERADMIN:
      menu.push(
        ...PMS_DASHBOARD_MENU_ITEMS,
        ...PMS_REPORT_MENU_ITEM,
        ...PMS_CONFIGURATION_MENU_ITEMS
      );
      break;

      default:
      menu = PMS_DASHBOARD_MENU_ITEMS;
      break;
    }
    return menu;
  }
}
