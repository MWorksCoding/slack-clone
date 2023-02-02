import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpOverviewComponent } from './sign-up-overview.component';

describe('SignUpOverviewComponent', () => {
  let component: SignUpOverviewComponent;
  let fixture: ComponentFixture<SignUpOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
