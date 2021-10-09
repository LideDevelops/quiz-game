import { Component, Input, OnInit } from '@angular/core';
import { QuizTopicModel } from '../models';
import { QuizFieldModel } from '../models/quiz-field-model';
import { StateService } from '../services/game-state/state.service';
@Component({
  selector: 'app-quiz-field',
  templateUrl: './quiz-field.component.html',
  styleUrls: ['./quiz-field.component.scss']
})
export class QuizFieldComponent implements OnInit {

  field: QuizFieldModel;
  topics: QuizTopicModel[];
  constructor(private state: StateService) {
    this.field = {Topics: []};
    this.topics = [];
   }

  ngOnInit(): void {
    this.state.quizFieldStateSubject.subscribe(x => {
      this.field = x;
      this.topics = x.Topics;
      console.log("New field:");
      console.log(x);
    });
  }

}
