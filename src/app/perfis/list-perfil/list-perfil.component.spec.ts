import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPerfilComponent } from './list-perfil.component';

describe('ListPerfilComponent', () => {
  let component: ListPerfilComponent;
  let fixture: ComponentFixture<ListPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
