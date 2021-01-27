import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPolicyDialogComponent } from './password-policy-dialog.component';

describe('PasswordPolicyDialogComponent', () => {
  let component: PasswordPolicyDialogComponent;
  let fixture: ComponentFixture<PasswordPolicyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordPolicyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordPolicyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
