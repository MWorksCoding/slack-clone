import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogErrorEmptyMessageComponent } from './dialog-error-empty-message.component';

describe('DialogErrorEmptyMessageComponent', () => {
  let component: DialogErrorEmptyMessageComponent;
  let fixture: ComponentFixture<DialogErrorEmptyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogErrorEmptyMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogErrorEmptyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
