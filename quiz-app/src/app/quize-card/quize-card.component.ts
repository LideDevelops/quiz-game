import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { QuizCardModel, QuizCardStateModel } from '../models/quiz-card-model';
import { QuizCardState } from '../models/quiz-card-state';

@Component({
  selector: 'app-quize-card',
  templateUrl: './quize-card.component.html',
  styleUrls: ['./quize-card.component.scss'],
  animations: [
    trigger('cardFlip', [
      state(QuizCardState.pointDisplay.toString(), style({
        transform: 'rotateY({{curentRotation}}deg)'
      }),{params: {curentRotation: 1}}),
      state(QuizCardState.question.toString(), style({
        transform: 'rotateY({{curentRotation}}deg)'
      }),{params: {curentRotation: 1}}),
      state(QuizCardState.answer.toString(), style({
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
export class QuizeCardComponent implements OnInit  {

  private _quizCard: QuizCardModel | any;
  public get quizCard(): QuizCardModel {
    return this._quizCard;
  }
  @Input()
  public set quizCard(value: QuizCardModel) {
    this._quizCard = value;
    this.quizcardState.changeStateTo(this.quizCard.State);
  }
  quizcardState: QuizCardStateModel;
  curentRotation = 0;

  constructor() {
    this._quizCard = null;
    this.quizcardState = new QuizCardStateModel(this.quizCard);
   }

  ngOnInit(): void {
  }


  handleOnQuizCardClick() {
    this.curentRotation = (this.curentRotation + 180) % 360;
    this.quizcardState.changeStateToNext()
  }

}
