import { Component, Input, OnInit } from '@angular/core';
import { QuizCardModel } from '../models/quiz-card-model';

@Component({
  selector: 'app-quize-card',
  templateUrl: './quize-card.component.html',
  styleUrls: ['./quize-card.component.scss']
})
export class QuizeCardComponent implements OnInit {

  @Input() quizCard: QuizCardModel;

  constructor() {
    this.quizCard = {question: ""}
   }

  ngOnInit(): void {
  }

}
