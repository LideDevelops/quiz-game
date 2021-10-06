import { Observable, ReplaySubject, Subject } from "rxjs";
import { QuizCardState } from "./quiz-card-state";
import { map } from 'rxjs/operators';

export class QuizCardStateModel {
  private model: QuizCardModel;
  private modelSubject = new ReplaySubject<QuizCardModel>(1);
  constructor(model: QuizCardModel) {
    this.model = model;
  }

  public getQuizCardDisplayObservable(): Observable<string> {
    return this.modelSubject.asObservable().pipe(map((x) => this.getQuizCardDisplay(x)));
  }

  public getQuizCardStateObservable(): Observable<QuizCardState> {
    return this.modelSubject.asObservable().pipe(map((x) => x.state));
  }

 public changeStateTo(state: QuizCardState) {
   this.model.state = state;
   this.modelSubject.next(this.model);
 }

 public changeStateToNext() {
  this.changeStateTo(this.getNextState())
}

private getNextState(): QuizCardState {
  switch (this.model.state) {
    case QuizCardState.pointDisplay:
      return QuizCardState.question;
    case QuizCardState.question:
      return QuizCardState.answer;
    case QuizCardState.answer:
      return QuizCardState.pointDisplay;
    default:
      return QuizCardState.pointDisplay;
  }
}

  private getQuizCardDisplay(model: QuizCardModel): string {
    switch (model.state) {
      case QuizCardState.pointDisplay:
        return model.points.toString();
      case QuizCardState.question:
        return model.question;
      case QuizCardState.answer:
        return model.answer;
      default:
        return ""
    }
  }
}

export interface QuizCardModel {
  question: string;
  answer: string;
  points: number;
  state: QuizCardState;
}
