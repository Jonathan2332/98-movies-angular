import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.css']
})
export class PageErrorComponent implements OnInit {

  faExclamationTriangle = faExclamationTriangle;

  constructor() { }

  ngOnInit() {
  }

}
