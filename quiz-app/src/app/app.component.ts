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
    topics: [
      {
        topicName: "Test1",
        quizCards: [
          {
            question: "1+1=?",
            answer: "2",
            points: 100,
            state: QuizCardState.pointDisplay
          }
        ]
      }
    ]
  }

}

