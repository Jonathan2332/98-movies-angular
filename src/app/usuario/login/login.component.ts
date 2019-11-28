import { RestService } from './../../shared/services/rest.service';
import { ApiService } from './../../shared/services/api.service';
import { SessionService } from '../../shared/services/session.service';
import { Component, OnInit } from '@angular/core';
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, Validators, FormBuilder, ValidationErrors, FormArray } from '@angular/forms';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  faAt = faAt;
  faLock = faLock;

  formulario: FormGroup;
  verificando: boolean = false;
  isMobile: boolean;

  constructor(private formBuilder: FormBuilder, 
    private router: Router, private sessionService: SessionService,
    private apiService: ApiService, private restService: RestService, 
    private deviceService: DeviceDetectorService) { this.isMobile = this.deviceService.isMobile(); }

  ngOnInit() 
  {
      this.formulario = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(70)]],
        password: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
        keepLoged: [false]
      });
  }

  onSubmit()
  {
    if(this.formulario.valid)
    {
      this.verificando = true;
      let valueSubmit = Object.assign({}, this.formulario.value);
      this.restService.login(valueSubmit).subscribe(dados => {
          if(dados['erro'])
          {
            Swal.fire({icon: 'error',title: dados['message']});
          }
          else
          {
              this.apiService.getCategorias().subscribe((genres : any[]) => {
                  dados['result']['genres'] = genres['genres'];

                  this.sessionService.createSession(dados['result'], valueSubmit.keepLoged);
                  let nome = this.sessionService.getNome();
                  let sexo = this.sessionService.getSexo();
                  Swal.fire({
                    title: sexo == 'M' ? `Bem Vindo ${nome}` : (sexo == 'F' ? `Bem Vinda ${nome}` : `Olá ${nome}`),
                    timer: 1500,
                    icon: 'info',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showClass: {
                      popup: 'animated fadeInDown faster'
                    },
                    onClose: () => {
                      this.router.navigate(['/usuario/home','populares']);
                    }
                  });
              });  
          }
          this.verificando = false;
        },
        (error: any) => {
          Swal.fire({icon: 'error',title: 'Ocorreu um erro.'});
          this.verificando = false;
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
      'email': `Email inválido.`,
    };

    return config[validatorName];
  }

}
