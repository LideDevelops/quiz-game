import { Observable, ReplaySubject, Subject } from "rxjs";
import { QuizCardState } from "./quiz-card-state";

export class QuizCardStateModel {
  private model: QuizCardModel;
  private displaySubject = new ReplaySubject<string>(1);
  constructor(model: QuizCardModel) {
    this.model = model;
  }

 public getQuizCardDisplayObservable(): Observable<string> {
   return this.displaySubject.asObservable();
 }

 public changeStateTo(state: QuizCardState) {
   this.model.state = state;
   this.displaySubject.next(this.getQuizCardDisplay());
 }

 public changeStateToNext() {
  switch (this.model.state) {
    case QuizCardState.pointDisplay:
      this.changeStateTo(QuizCardState.question);
      break;
    case QuizCardState.question:
      this.changeStateTo(QuizCardState.answer);
      break;
    case QuizCardState.answer:
      this.changeStateTo(QuizCardState.pointDisplay);
      break;
    default:
      this.changeStateTo(QuizCardState.pointDisplay);
  }
}

  private getQuizCardDisplay(): string {
    switch (this.model.state) {
      case QuizCardState.pointDisplay:
        return this.model.points.toString();
      case QuizCardState.question:
        return this.model.question;
      case QuizCardState.answer:
        return this.model.answer;
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
