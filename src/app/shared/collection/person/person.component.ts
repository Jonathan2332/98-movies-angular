import { Component, OnInit, Input } from '@angular/core';
import { faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  @Input() list: any[];
  faPlus = faPlus;
  faInfoCircle = faInfoCircle;
  @Input() requesting: boolean;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    
  }

  getImage(url: string)
  {
    return this.apiService.getApiImg(true, url, 500);
  }

  onLoad(id_person)
  {
    document.getElementById('loader-'+id_person).classList.remove("loader-image");
  }
}
