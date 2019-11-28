import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isMobile: boolean;
  constructor(private deviceService: DeviceDetectorService) { 
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
  }

}
