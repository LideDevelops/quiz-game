import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { QuizCardModel, QuizCardStateModel } from '../models/quiz-card-model';
import { QuizCardState } from '../models/quiz-card-state';

@Component({
  selector: 'app-quize-card',
  templateUrl: './quize-card.component.html',
  styleUrls: ['./quize-card.component.scss']
})
export class QuizeCardComponent implements OnInit {

  @Input() quizCard: QuizCardModel;
  quizcardState: QuizCardStateModel;

  constructor() {
    this.quizCard = {question: "", answer: "", points: 0, state: QuizCardState.question};
    this.quizcardState = new QuizCardStateModel(this.quizCard);
   }

  ngOnInit(): void {
    this.quizcardState = new QuizCardStateModel(this.quizCard);
    this.quizcardState.changeStateTo(QuizCardState.pointDisplay);
  }


  handleOnQuizCardClick() {
    this.quizcardState.changeStateToNext()
  }

}
