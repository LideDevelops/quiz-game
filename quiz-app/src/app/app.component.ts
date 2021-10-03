import { Component } from '@angular/core';
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
          {question: "1+1=?"}
        ]
      }
    ]
  }

}

