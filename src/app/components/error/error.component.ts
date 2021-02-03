import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input("message")
  errMessage: string = "Sorry, Something Went Wrong: Please try again later.";

  constructor() { }

  reload() {
    window.location.reload();
  }

  ngOnInit(): void {
  }

}
