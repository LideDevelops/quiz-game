import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFieldComponent } from './quiz-field.component';

describe('QuizFieldComponent', () => {
  let component: QuizFieldComponent;
  let fixture: ComponentFixture<QuizFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
