import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-monitoring-details',
  templateUrl: './monitoring-details.component.html',
  styleUrls: ['./monitoring-details.component.scss']
})
export class MonitoringDetailsComponent implements OnInit {
@Input() monitoringDataColumn: any;
@Input() monitoringDataRow: any;
objectKeys(obj) {
  return Object.keys(obj);
}
  constructor() { }

  ngOnInit() {
  }
 

}
