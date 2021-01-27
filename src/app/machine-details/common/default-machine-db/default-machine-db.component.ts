import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-default-machine-db',
  templateUrl: './default-machine-db.component.html',
  styleUrls: ['./default-machine-db.component.scss']
})
export class DefaultMachineDbComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
  }

  onCardClick(e) {
    this.goTo(e);
   }

  

  goTo(route: string) {
    this.router.navigate([`machinedetail/${route}`]);
  }

}
