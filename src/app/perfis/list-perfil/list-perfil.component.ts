import { RestService } from 'src/app/shared/services/rest.service';
import { Component, OnInit } from '@angular/core';
import { faEdit, faTrashAlt, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-perfil',
  templateUrl: './list-perfil.component.html',
  styleUrls: ['./list-perfil.component.css']
})
export class ListPerfilComponent implements OnInit {

  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faIdBadge = faIdBadge;
  requesting: boolean = false;
  perfis:any = [];

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.requesting = true;
    this.restService.getAllPerfisFromRest().subscribe(dados => { 
      this.perfis = dados;
      this.requesting = false;
    },
    (erro:any) => {
        Swal.fire({
          title: 'Ocorreu um erro.',
          icon: 'error',
          showConfirmButton: true
        });
        this.requesting = false;
    });
  }

  check(value, index)
  {
      Swal.fire({
        title: 'Você tem certeza?',
        text: "Você não pode reverter esta ação!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.restService.deletePerfilFromRest(value).subscribe((result:any) => {
              if(!result.erro)
              {
                    Swal.fire({
                      title: 'Operação realizada com sucesso!',
                      icon: 'success',
                      showConfirmButton: true,
                        onClose: () => {
                            this.perfis.splice(index, 1);
                        }
                    })
              }
              else
              {
                  Swal.fire({
                    title: 'Ocorreu um erro.',
                    icon: 'error',
                    showConfirmButton: true
                  });
              }
          },
          (erro:any) => Swal.fire({
            title: 'Ocorreu um erro.',
            icon: 'error',
            showConfirmButton: true
          }));
        }
      });
  }
}
