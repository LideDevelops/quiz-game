import { Component } from '@angular/core';
import { QuizCardState } from './models/quiz-card-state';
import { QuizFieldModel } from './models/quiz-field-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'quiz-app';

  demoData: QuizFieldModel = {
    Topics: [
      {
        TopicName: "Test1",
        QuizCards: [
          {
            Question: "1+1=?",
            Answer: "2",
            Points: 100,
            State: QuizCardState.answer,
            Id: 0
          }
        ],
        Id: 0
      }
    ]
  }

}

