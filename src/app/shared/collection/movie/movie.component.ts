import { ApiService } from './../../services/api.service';
import { Component, OnInit, Input } from '@angular/core';
import { faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  @Input() list: any[];
  faPlus = faPlus;
  faInfoCircle = faInfoCircle;
  @Input() requesting: boolean;
  @Input() idType:any;

  constructor(private apiService: ApiService) {


  }

  ngOnInit() {
  }

  getImage(url: string)
  {
    return this.apiService.getApiImg(false, url, 500);
  }

  onLoad(id_filme)
  {
    document.getElementById('loader-'+id_filme+'-'+this.idType).classList.remove("loader-image");
  }

}
