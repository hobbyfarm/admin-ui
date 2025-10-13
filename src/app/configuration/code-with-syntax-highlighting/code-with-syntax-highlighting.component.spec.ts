import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeWithSyntaxHighlightingComponent } from './code-with-syntax-highlighting.component';

describe('CodeWithSyntaxHighlightingComponent', () => {
  let component: CodeWithSyntaxHighlightingComponent;
  let fixture: ComponentFixture<CodeWithSyntaxHighlightingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodeWithSyntaxHighlightingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeWithSyntaxHighlightingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
