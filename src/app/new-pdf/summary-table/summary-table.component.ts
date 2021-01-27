import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html',
  styleUrls: ['./summary-table.component.scss']
})
export class SummaryTableComponent implements OnInit {
  @Input() summaryData: any ;
  count = [1, 2];
 // public summaryData;
  // data = [
  //   [
  //     {
  //       TITLE :  'Monitoring Parameters',
  //         boxdata : {
  //         FIRST_BOX_KEY_1 : 'Voltage',
  //       FIRST_BOX_KEY_2 : 'Current',
  //       FIRST_BOX_KEY_3 : 'Frequency'
  //       }
  //     },
  //     {
  //     TITLE :  'Monitoring Parameters',
  //       boxdata :{
  //         FIRST_BOX_KEY_1 : 'Voltage',
  //       FIRST_BOX_KEY_2 : 'Current',
  //       FIRST_BOX_KEY_3 : 'Frequency'
  //       }
  //     }
  //   ],
  //   [
  //          {
  //     TITLE :  'Monitoring Parameters',
  //     boxdata :{
  //       FIRST_BOX_KEY_1 : 'Voltage',
  //     FIRST_BOX_KEY_2 : 'Current',
  //     FIRST_BOX_KEY_3 : 'Frequency'
  //     }
  //     },
  //           {
  //     TITLE :  'Monitoring Parameters',
  //     boxdata : {
  //       FIRST_BOX_KEY_1 : 'Voltage',
  //     FIRST_BOX_KEY_2 : 'Current',
  //     FIRST_BOX_KEY_3 : 'Frequency'
  //     }
  //     }
  //   ],
  // ];
   objectKeys(obj) {
    return Object.keys(obj);
}
  constructor() { }

  ngOnInit() {
  }

}
