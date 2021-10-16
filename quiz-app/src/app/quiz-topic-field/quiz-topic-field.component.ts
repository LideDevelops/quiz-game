import { Component, Input, OnInit } from '@angular/core';
import { QuizTopicModel } from '../models/quiz-topic-model';

@Component({
  selector: 'app-quiz-topic-field',
  templateUrl: './quiz-topic-field.component.html',
  styleUrls: ['./quiz-topic-field.component.scss']
})
export class QuizTopicFieldComponent implements OnInit {

  @Input() topic: QuizTopicModel;

  constructor() {
    this.topic = { TopicName: "", QuizCards: [], Id: 0}
  }

  ngOnInit(): void {
  }

}
