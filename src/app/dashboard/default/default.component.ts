import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AutoLogoutService } from "src/app/auto-logout.service";
import { DATA } from "src/app/core/data.enum";
import { StorageServiceService } from "src/app/core/services/auth/storage-service.service";
import { DashboardService } from '../dashboard.service';
@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"]
})
export class DefaultComponent implements OnInit {
  loaded: boolean;
  machineID: number;
  constructor(private storageServiceService: StorageServiceService, private autoLogoutService: AutoLogoutService,
    private dashboardService: DashboardService, private router: Router) { }

  ngOnInit() {
    this.storageServiceService.setStorageItem(DATA.LAST_ACTION, Date.now().toString());
  }

  onCardClick(e) {
    this.goTo(e);
  }

  onSelect(e) {
    this.loaded = false;
    this.machineID = e.machineID;
    setTimeout(() => (this.loaded = true), 500);
  }

  goTo(route: string) {
    this.router.navigate([`dashboard/${route}`]);
  }
}

