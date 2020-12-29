import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessCodesComponent } from './edit-access-codes.component';

describe('EditAccessCodesComponent', () => {
  let component: EditAccessCodesComponent;
  let fixture: ComponentFixture<EditAccessCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAccessCodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccessCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
