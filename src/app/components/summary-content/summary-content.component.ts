import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-summary-content',
  templateUrl: './summary-content.component.html',
  styleUrls: ['./summary-content.component.scss']
})
export class SummaryContentComponent implements OnInit {
 @Input() testdata: string;
  constructor() { }

  ngOnInit() {
  }

}
