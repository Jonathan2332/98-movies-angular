import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {

  queryShow: string;
  query : string;
  type: string;
  inscricao: Subscription;
  
  constructor(private route: ActivatedRoute) {
    this.inscricao = this.route.queryParams.subscribe((params) => { 

      this.type = params.type;
      this.query = encodeURIComponent(params.query);
      this.queryShow = params.query;

    });

  }

  ngOnInit() {
    
  }
  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

}
