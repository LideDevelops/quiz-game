import { Component, Input, OnInit } from '@angular/core';
import { QuizFieldModel } from '../models/quiz-field-model';
@Component({
  selector: 'app-quiz-field',
  templateUrl: './quiz-field.component.html',
  styleUrls: ['./quiz-field.component.scss']
})
export class QuizFieldComponent implements OnInit {

  @Input() field: QuizFieldModel;

  constructor() {
    this.field = {topics: []}
   }

  ngOnInit(): void {
  }

}
