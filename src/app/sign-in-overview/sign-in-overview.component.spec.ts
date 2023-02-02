import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInOverviewComponent } from './sign-in-overview.component';

describe('SignInOverviewComponent', () => {
  let component: SignInOverviewComponent;
  let fixture: ComponentFixture<SignInOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignInOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
