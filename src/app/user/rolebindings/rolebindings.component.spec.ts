import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolebindingsComponent } from './rolebindings.component';

describe('RolebindingsComponent', () => {
  let component: RolebindingsComponent;
  let fixture: ComponentFixture<RolebindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolebindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolebindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
