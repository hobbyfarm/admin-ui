import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressInfoComponent } from './progress-info.component';

describe('ProgressInfoComponent', () => {
  let component: ProgressInfoComponent;
  let fixture: ComponentFixture<ProgressInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
