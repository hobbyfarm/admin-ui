import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRoleBindingComponent } from './new-role-binding.component';

describe('NewRoleBindingComponent', () => {
  let component: NewRoleBindingComponent;
  let fixture: ComponentFixture<NewRoleBindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRoleBindingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRoleBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
