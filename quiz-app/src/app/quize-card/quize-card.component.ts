import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { QuizCardModel, QuizCardStateModel } from '../models/quiz-card-model';
import { QuizCardState } from '../models/quiz-card-state';

@Component({
  selector: 'app-quize-card',
  templateUrl: './quize-card.component.html',
  styleUrls: ['./quize-card.component.scss'],
  animations: [
    trigger('cardFlip', [
      state(QuizCardState.pointDisplay, style({
        transform: 'rotateY({{curentRotation}}deg)'
      }),{params: {curentRotation: 1}}),
      state(QuizCardState.question, style({
        transform: 'rotateY({{curentRotation}}deg)'
      }),{params: {curentRotation: 1}}),
      state(QuizCardState.answer, style({
        transform: 'rotateY({{curentRotation}}deg)'
      }),{params: {curentRotation: 1}}),
      transition(QuizCardState.pointDisplay + ' => ' + QuizCardState.question , [
        animate('400ms')
      ]),
      transition(QuizCardState.question + ' => ' + QuizCardState.answer, [
        animate('400ms')
      ]),
      transition(QuizCardState.answer + ' => ' + QuizCardState.pointDisplay, [
        animate('400ms')
      ])
    ])
  ]
})
export class QuizeCardComponent implements OnInit {

  @Input() quizCard: QuizCardModel;
  quizcardState: QuizCardStateModel;
  curentRotation = 0;

  constructor() {
    this.quizCard = {question: "", answer: "", points: 0, state: QuizCardState.question};
    this.quizcardState = new QuizCardStateModel(this.quizCard);
   }

  ngOnInit(): void {
    this.quizcardState = new QuizCardStateModel(this.quizCard);
    this.quizcardState.changeStateTo(QuizCardState.pointDisplay);
  }


  handleOnQuizCardClick() {
    this.curentRotation = (this.curentRotation + 180) % 360;
    this.quizcardState.changeStateToNext()
  }

}
