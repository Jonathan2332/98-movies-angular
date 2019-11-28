import { RestService } from 'src/app/shared/services/rest.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { faIdBadge, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-formulario-perfil',
  templateUrl: './formulario-perfil.component.html',
  styleUrls: ['./formulario-perfil.component.css']
})
export class FormularioPerfilComponent implements OnInit {

  formulario: FormGroup;
  requesting: boolean = false;
  inscricao: Subscription;
  request: Subscription;
  faIdBadge = faIdBadge;
  faTimes = faTimes;
  faCheck = faCheck;
  id:any;
  
  constructor(private router:Router, private restService: RestService, 
    private formBuilder: FormBuilder){

      this.formulario = this.formBuilder.group({
        nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
      });
  
      this.inscricao = this.router.events.subscribe((event: Event) => 
      {
          if (event instanceof NavigationEnd) {
            this.id = event.urlAfterRedirects.split("/").pop();
            
            if(this.isNumber(this.id))
            {
                this.restService.getPerfilFromRest(this.id).subscribe((dados:any) => { 
                    this.formulario.patchValue({nome: dados.nome});
                });
            }
          }
      });
  }

  ngOnInit() {

  }
  ngOnDestroy() {
    if(this.request != null)
      this.request.unsubscribe();

    this.inscricao.unsubscribe();
  }

  isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

  abort()
  {
    if(this.request != null)
      this.request.unsubscribe();
      
    this.router.navigate(['/perfis/index']);
  }

  onSubmit()
  {
    if(this.formulario.valid)
    {
      this.requesting = true;
      let valueSubmit = Object.assign({}, this.formulario.value, this.isNumber(this.id) ? {'idPerfil':this.id} : {});
      
      this.request = this.restService.savePerfilFromRest(valueSubmit).pipe(map(res => res)).subscribe(dados => {
          if(dados['erro'])
          {
            Swal.fire({icon: 'error',title: dados['message']});
          }
          else
          {
              this.requesting = false;
              Swal.fire({
                title: dados['message'],
                timer: 1500,
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showClass: {
                  popup: 'animated fadeInDown faster'
                },
                onClose: () => {
                  this.router.navigate(['/perfis/index']);
                }
              });
          }
        },
        (error: any) => {
          Swal.fire({icon: 'error',title: 'Ocorreu um erro.'});
          this.requesting = false;
        }); 
    }
    else
      this.verificaValidacoesForm(this.formulario);

    return false;
  }

  verificaValidacoesForm(formGroup: FormGroup|FormArray)
  {
      Object.keys(formGroup.controls).forEach(campo => {
        const controle = formGroup.get(campo);
        controle.markAsDirty();
        controle.markAsTouched();
        if(controle instanceof FormGroup || controle instanceof FormArray)
        {
          this.verificaValidacoesForm(controle);
        }
      });
  }

  checkError(campo: string)
  {
      const controlErrors: ValidationErrors = this.formulario.get(campo).errors;
      if (controlErrors != null) 
        return !this.formulario.get(campo).valid && (this.formulario.get(campo).touched || this.formulario.get(campo).dirty);
      else
        return false;
  }

  aplicaCssErro(campo: string)
  {
    return {
        'is-invalid': this.checkError(campo)
    }
  }

  checkMessage(campo: string)
	{
      let errorMsg: string;
      const controlErrors: ValidationErrors = this.formulario.get(campo).errors;
      if (controlErrors != null) 
      {
            Object.keys(controlErrors).forEach(keyError => {
              errorMsg = this.getErrorMsg(keyError, controlErrors[keyError]);
            });
      }
      return errorMsg;
	}

  getErrorMsg(validatorName: string, validatorValue?: any) {
    const config = {
      'required': `Este campo é obrigatório.`,
      'minlength': `Este campo precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `Este campo só pode ter no máximo ${validatorValue.requiredLength} caracteres.`,
    };

    return config[validatorName];
  }

}
