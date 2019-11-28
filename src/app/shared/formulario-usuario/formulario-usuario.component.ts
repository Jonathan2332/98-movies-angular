import { RestService } from 'src/app/shared/services/rest.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { faUser, faCamera, faCheck, faTimes, faUserEdit, faMapMarkerAlt, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ConsultaCepService } from '../services/consulta-cep.service';
import { ApiService } from '../services/api.service';
import { VerificaEmailService } from '../services/verifica-email.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
import { SessionService } from '../services/session.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css']
})
export class FormularioUsuarioComponent implements OnInit {

  formulario: FormGroup;
  categorias: any[];
  perfis: any[];
  model: NgbDateStruct;
  placement = 'bottom';
  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  faTimes = faTimes;
  faCheck = faCheck;
  faUser = faUser;
  faCamera = faCamera;
  faUserEdit = faUserEdit;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendarAlt = faCalendarAlt;

  inscricao: Subscription;
  usuario:any;

  loader: boolean = false;
  @Input() isAdmin: boolean = false;
  @Input() isDisabled: boolean = false;
  data: NgbDate = new NgbDate(1789, 7, 14);

  fileData: File = null;

  isMobile: boolean;

  preferences = [];
  
  constructor(private cepService: ConsultaCepService, 
    private formBuilder: FormBuilder, private apiService: ApiService,
    private emailService: VerificaEmailService, private datePipe: DatePipe,
    private router: Router, private restService: RestService,
    private route: ActivatedRoute, private sessionService: SessionService, 
    private deviceService: DeviceDetectorService) { this.isMobile = this.deviceService.isMobile(); }

  ngOnInit() {

    this.inscricao = this.route.data.subscribe(
      (info) => {
        this.usuario = (info.usuario);
      }
    );

    this.apiService.getCategorias().subscribe((dados : any[]) => { this.categorias = dados['genres']; });

    this.restService.getAllPerfisFromRest().subscribe((dados : any[]) => { this.perfis = dados; });

    let splittedDate = this.splitDate(this.usuario.data_nasc);
    let year = splittedDate[0];
    let month = splittedDate[1];
    let day = splittedDate[2];
    this.model = { year: parseInt(year), month: parseInt(month), day: parseInt(day) };

    
    for(let i = 0; i < this.usuario.categoria.length; i++)
    {
       this.preferences[i] = parseInt(this.usuario.categoria[i].idCategoria);
    }

    this.usuario = Object.assign({}, this.usuario, {'caminho' : this.getImage(this.usuario.caminho) });

    let senha = new FormControl(this.usuario.senha, Validators.required);
    let csenha = new FormControl(this.usuario.senha, [Validators.required, CustomValidators.equalTo(senha)]);

    this.formulario = this.formBuilder.group({
      nome: [this.usuario.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      sobrenome: [this.usuario.sobrenome, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      idPerfil: [this.usuario.idPerfil],
      idUsuario: [this.usuario.idUsuario],
      idEndereco: [this.usuario.idEndereco],
      foto:[null],
      sexo: [this.usuario.sexo, [Validators.required, Validators.minLength(1)]],
      email: [this.usuario.email, [Validators.required, CustomValidators.email], [this.validarEmail.bind(this)]],
      cont_adulto: [this.usuario.cont_adulto],
      senha: senha,
      csenha: csenha,
      categoria: [this.preferences, [Validators.required, Validators.minLength(3)]],
      data_nasc:[this.model, Validators.required],
      telefone:[this.usuario.telefone, Validators.required],
      celular:[this.usuario.celular, Validators.required],
      cep: [this.usuario.cep, [Validators.required]],
      complemento: [this.usuario.complemento],
      bairro: [this.usuario.bairro, Validators.required],
      localidade: [this.usuario.localidade, Validators.required],
      uf: [this.usuario.uf, Validators.required]
    });
  }

  onCancel()
  {
    if(this.isAdmin)
    {
      this.router.navigate(['/usuario/gerenciar']);
    }
    else{
      this.isDisabled = !this.isDisabled;
      this.redefinirPadrao();
    }
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
                    title: this.isAdmin ? 'Operação realizado com sucesso!' : 'Perfil alterado com sucesso!',
                    onClose: () => {
                      if(this.isAdmin)
                        this.router.navigate(['/usuario/gerenciar']);
                      else{
                        this.updateUsuario(valueSubmit);
                        this.isDisabled = !this.isDisabled;
                      }
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
  splitDate(date){
    var result = date.split('-');
    return result;
  }
  calculateAgeInYears (date) {
      var now = new Date();
      var current_year = now.getFullYear();
      var year_diff = current_year - date.getFullYear();
      var birthday_this_year = new Date(current_year, date.getMonth(), date.getDate());
      var has_had_birthday_this_year = (now >= birthday_this_year);

      return has_had_birthday_this_year
          ? year_diff
          : year_diff - 1;
  }
  updateUsuario(valueSubmit)
  {
    this.usuario = Object.assign({}, this.usuario, { idade: this.calculateAgeInYears(new Date(this.usuario.data_nasc)) }, valueSubmit);
    
    this.sessionService.updateSession(Object.assign({}, {
      'categoria': this.usuario.categoria, 'cont_adulto': this.usuario.cont_adulto, 'email': this.usuario.email,
      'nome': this.usuario.nome, 'sexo': this.usuario.sexo, 'idUsuario': this.usuario.idUsuario,
      'idEndereco': this.usuario.idEndereco, 'idPerfil': this.usuario.idPerfil
    }));
  }
  
  getImage(caminho)
  {
    return caminho ? `https://98movies.000webhostapp.com/res/imgs/usuario/upload/${caminho}` : '../../../../../assets/imgs/no-perfil-photo.png';
  }

  onFileChanged(event: any) 
  {
    this.fileData = <File>event.target.files[0];
    if(this.fileData != null)
      this.checkAndUpload();
  }
  checkAndUpload()
  {
    if(this.fileData.size > 1000000)
    {
      Swal.fire({
        title: 'O tamanho máximo da foto é de 1MB!',
        icon: 'info',
        showConfirmButton: true
      });
      this.fileData = null;
      this.formulario.value.foto = null;
      return;
    }
    const formData = new FormData();
    formData.append('foto', this.fileData);
    formData.append('idUsuario', this.usuario.idUsuario);

    Swal.fire({
        title: 'Carregando...',
        width: 300,
        allowEscapeKey: false,
        allowOutsideClick: false,
        timerProgressBar: true,
        onBeforeOpen: () => {
          Swal.showLoading();

          this.restService.uploadImage(formData).subscribe(dados => {

            if(dados['erro'])
            {
              Swal.fire({icon: 'error',title: dados['message']});
            }
            else{

              Swal.hideLoading();
              Swal.fire({
                icon: 'success',
                title: 'Foto atualizada com sucesso!',
                onClose: () => {
                  window.location.reload();
                }
              });
            }
          },
          (error: any) => {
            Swal.fire({icon: 'error',title: 'Ocorreu um erro.'});
            this.fileData = null;
            this.formulario.value.foto = null;
          });
        }
    });
  }

  redefinirPadrao()
  {
    this.formulario.setValue({
      nome: this.usuario.nome,
      sobrenome: this.usuario.sobrenome,
      idPerfil: this.usuario.idPerfil,
      idUsuario: this.usuario.idUsuario,
      idEndereco: this.usuario.idEndereco,
      foto: null,
      sexo: this.usuario.sexo,
      email: this.usuario.email,
      cont_adulto: this.usuario.cont_adulto,
      senha: this.usuario.senha,
      csenha: this.usuario.senha,
      categoria: this.preferences,
      data_nasc: this.model,
      telefone:this.usuario.telefone,
      celular:this.usuario.celular,
      cep: this.usuario.cep,
      complemento: this.usuario.complemento,
      bairro: this.usuario.bairro,
      localidade: this.usuario.localidade,
      uf: this.usuario.uf
    });
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
      if(formControl.value != this.usuario.email)
        return this.emailService.verificarEmail(formControl.value).pipe(map(emailExiste => emailExiste['message'] ? { emailInvalido: true } : null));
      else 
        return of(null);
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
        return (!this.formulario.get(campo).valid && (this.formulario.get(campo).touched && !this.isDisabled) || this.formulario.get(campo).dirty);
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