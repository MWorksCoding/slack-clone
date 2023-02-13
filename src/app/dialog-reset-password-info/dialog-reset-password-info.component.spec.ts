import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResetPasswordInfoComponent } from './dialog-reset-password-info.component';

describe('DialogResetPasswordInfoComponent', () => {
  let component: DialogResetPasswordInfoComponent;
  let fixture: ComponentFixture<DialogResetPasswordInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogResetPasswordInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogResetPasswordInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
