import { RestService } from 'src/app/shared/services/rest.service';
import { faUserTimes, faUserEdit, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerenciar',
  templateUrl: './gerenciar.component.html',
  styleUrls: ['./gerenciar.component.css']
})
export class GerenciarComponent implements OnInit {

  usuarios:any[];
  faUserTimes = faUserTimes;
  faUserEdit = faUserEdit;
  faUsers = faUsers;
  requesting: boolean = false;

  constructor(private restService: RestService) { }

  ngOnInit() {
    this.requesting = true;
    this.restService.getAllUsersFromRest().subscribe((dados:any) => {
      this.usuarios = dados;
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
          this.restService.deleteUserFromRest(value).subscribe((result:any) => {
              if(!result.erro)
              {
                    Swal.fire({
                      title: 'Operação realizada com sucesso!',
                      icon: 'success',
                      showConfirmButton: true,
                        onClose: () => {
                            this.usuarios.splice(index, 1);
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
