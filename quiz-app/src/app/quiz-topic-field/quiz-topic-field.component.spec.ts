import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTopicFieldComponent } from './quiz-topic-field.component';

describe('QuizTopicFieldComponent', () => {
  let component: QuizTopicFieldComponent;
  let fixture: ComponentFixture<QuizTopicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizTopicFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizTopicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
