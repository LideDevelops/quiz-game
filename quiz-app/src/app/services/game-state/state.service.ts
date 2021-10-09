import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { delay, filter, map, retryWhen, switchMap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { QuizCardModel, QuizCardStateModel, QuizFieldModel } from 'src/app/models';
import { QuizCardState } from 'src/app/models/quiz-card-state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _connection$: WebSocketSubject<any>;
  private _quizFieldState: ReplaySubject<QuizFieldModel>;
  private _currentQuizField: QuizFieldModel;
  private connectionUri = "wss://localhost:44314/Room/state";

  RETRY_SECONDS = 10;

  constructor() {
    this._connection$ = webSocket(this.connectionUri);
    this._quizFieldState = new ReplaySubject<QuizFieldModel>(1);
    this._currentQuizField = {Topics: []};
    this._quizFieldState.subscribe(x => this._currentQuizField = x);
    this._quizFieldState.next({Topics: []});
    this.connect();
    this._connection$.subscribe(x => {
      console.log(x);
      this._quizFieldState.next( x);
    });
  }

  public get quizFieldStateSubject(): ReplaySubject<QuizFieldModel> {
    return this._quizFieldState;
  }

  private connect(): Observable<any> {
    return of(this.connectionUri).pipe(
      filter(apiUrl => !!apiUrl),
      // https becomes wws, http becomes ws
      map(apiUrl => apiUrl.replace(/^http/, 'ws')),
      switchMap(wsUrl => {
        if (this._connection$) {
          return this._connection$;
        } else {
          this._connection$ = webSocket(wsUrl);
          return this._connection$;
        }
      }),
      retryWhen((errors) => errors.pipe(delay(this.RETRY_SECONDS)))
    );
  }

  updateQuizCardState(newCardState: QuizCardState, toChange: QuizCardModel) {
    let newField = this._currentQuizField;
    newField.Topics.forEach(topic =>
      topic.QuizCards.forEach(currentCard => {
        if(currentCard.Answer === toChange.Answer && currentCard.Points === currentCard.Points && currentCard.Question === currentCard.Question && currentCard.State === currentCard.State) {
          currentCard.State = newCardState;
        }
      })
      )
    this._quizFieldState.next(newField);
  }

  private send(data: any) {
    if (this._connection$) {
      this._connection$.next(data);
    } else {
      console.error('Did not send data, open a connection first');
    }
  }

  private closeConnection() {
    if (this._connection$) {
      this._connection$.complete();
    }
  }
  ngOnDestroy() {
    this.closeConnection();
  }
}
