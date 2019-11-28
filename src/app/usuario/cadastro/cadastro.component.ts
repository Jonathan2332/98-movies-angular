import { RestService } from 'src/app/shared/services/rest.service';
import { ApiService } from './../../shared/services/api.service';
import { Router } from '@angular/router';
import { ConsultaCepService } from './../../shared/services/consulta-cep.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import Swal from 'sweetalert2'
import { map }  from 'rxjs/operators'
import { VerificaEmailService } from 'src/app/shared/services/verifica-email.service';
import { faCalendarAlt, faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {

  formulario: FormGroup;
  categorias: any[];
  model: NgbDateStruct;
  placement = 'bottom';
  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  faCalendarAlt = faCalendarAlt;
  faMapMarkerAlt = faMapMarkerAlt;
  faUser = faUser;

  loader: boolean = false;
  isMobile: boolean;

  constructor(private cepService: ConsultaCepService, 
    private formBuilder: FormBuilder, private apiService: ApiService,
    private emailService: VerificaEmailService, private datePipe: DatePipe,
    private router: Router, private restService: RestService,
    private deviceService: DeviceDetectorService) { this.isMobile = this.deviceService.isMobile(); }

  ngOnInit() {

    this.apiService.getCategorias().subscribe((dados : any[]) => { this.categorias = dados['genres']; });

    let senha = new FormControl('', Validators.required);
    let csenha = new FormControl('', [Validators.required, CustomValidators.equalTo(senha)]);

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      sobrenome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      idPerfil: [1],
      sexo: [null, [Validators.required, Validators.minLength(1)]],
      email: [null, [Validators.required, CustomValidators.email], [this.validarEmail.bind(this)]],
      cont_adulto: [0],
      senha: senha,
      csenha: csenha,
      categoria: [null, [Validators.required, Validators.minLength(3)]],
      data_nasc:[null, Validators.required],
      telefone:[null, Validators.required],
      celular:[null, Validators.required],
      cep: [null, [Validators.required]],
      complemento: [null],
      bairro: [null, Validators.required],
      localidade: [null, Validators.required],
      uf: [null, Validators.required]
    });
  }

  onSubmit()
  {
    if(this.formulario.valid)
    {
        Swal.fire({
          title: 'Aguarde, carregando...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading();

            let valueSubmit = Object.assign({}, this.formulario.value);
   
            let ngbDate = this.formulario.controls['data_nasc'].value;
            let myDate = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
            let newDate = this.datePipe.transform(myDate, 'dd/MM/yyyy');
            valueSubmit['data_nasc'] = newDate;

            

            this.restService.saveUserFromRest(valueSubmit).subscribe(dados => {
                if(dados['erro'])
                {
                  Swal.fire({icon: 'error',title: dados['message']});
                }
                else{
                  Swal.hideLoading();
                  Swal.fire({
                    icon: 'success',
                    title: 'Cadastro realizado com sucesso!',
                    onClose: () => {
                        this.router.navigate(['/usuario/login']);
                    }
                  });
                }
              },
              (error: any) => Swal.fire({icon: 'error',title: 'Ocorreu um erro.'}));
          },
        });
    }
    else
      this.verificaValidacoesForm(this.formulario)
      
    return false;
  }
  resetar()
  {
    this.formulario.reset();
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

  checkCep()
  {
    this.loader = true;
    let cep = this.formulario.get('cep').value;
    this.cepService.consultaCep(cep).subscribe(dados => {
      if(dados['erro'])
        Swal.fire({icon: 'error',title: dados['msg'] ? dados['msg'] : 'CEP não encontrado!' });
      else
        this.populaEndereco(dados);
        this.loader = false;
    },
     (error: any) => {
        Swal.fire({icon: 'error',title: 'Ocorreu um erro.'});
        this.loader = false;
      });
        
  }
  validarEmail(formControl: FormControl)
  {
      return this.emailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste['message'] ? { emailInvalido: true } : null));
  }

  populaEndereco(dados)
  {
      this.formulario.patchValue({
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        localidade: dados.localidade,
        uf: dados.uf
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
              errorMsg = this.getErrorMsg(campo, keyError, controlErrors[keyError]);
            });
      }
      return errorMsg;
	}

  getErrorMsg(campo: string, validatorName: string, validatorValue?: any) {
    const config = {
      'required': `Este campo é obrigatório.`,
      'email': `Email inválido.`,
      'minlength': campo == 'categoria' || campo == 'sexo' ? `Selecione ao menos ${validatorValue.requiredLength} opções!` : `Este campo precisa ter no mínimo ${validatorValue.requiredLength} caracteres.`,
      'maxlength': `Este campo só pode ter no máximo ${validatorValue.requiredLength} caracteres.`,
      'emailInvalido': 'Este email já está sendo usado!',
      'equalTo': 'As senhas não coincidem',
      'ngbDate': 'Data inválida',
      'pattern': 'Campo inválido'
    };

    return config[validatorName];
  }

}
