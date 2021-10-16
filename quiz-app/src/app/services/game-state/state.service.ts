import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { delay, filter, map, retryWhen, switchMap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { QuizCardModel, QuizCardStateModel, QuizFieldModel } from 'src/app/models';
import { QuizCardState } from 'src/app/models/quiz-card-state';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private _connection$: WebSocketSubject<any> | undefined;
  private _quizFieldState: ReplaySubject<QuizFieldModel>;
  private _currentQuizField: QuizFieldModel;
  private connectionUri = "https://localhost:44314/";

  RETRY_SECONDS = 10;

  constructor(private http: HttpClient) {
    this._quizFieldState = new ReplaySubject<QuizFieldModel>(1);
    this._currentQuizField = {Topics: []};
    this._quizFieldState.subscribe(x => this._currentQuizField = x);
    this._quizFieldState.next({Topics: []});
    this.getCurrentState();
    this.connect();
    if(this._connection$) {
      this._connection$.subscribe(x => {
        console.log(x);
        let arr = new Int32Array(x);
        let newState = this._currentQuizField;
        newState.Topics
        .filter(x => x.Id === arr[0])
        .map(x => x.QuizCards.filter(y => y.Id == arr[1]))
        .reduce(x => x)
        .forEach(x => x.State = arr[2]);
        this._quizFieldState.next(newState);
      });
    }
  }

  public get quizFieldStateSubject(): ReplaySubject<QuizFieldModel> {
    return this._quizFieldState;
  }

  private getCurrentState() {
    this.http.get<QuizFieldModel>(`${this.connectionUri}Room/currentField`).subscribe(x => this._currentQuizField = x);
  }

  private connect(): Observable<any> {
    return of(this.connectionUri+'Room/state').pipe(
      filter(apiUrl => !!apiUrl),
      // https becomes wws, http becomes ws
      map(apiUrl => apiUrl.replace(/^http/, 'ws')),
      switchMap(wsUrl => {
        console.log(wsUrl);
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

  updateQuizCardState(topicId: number, cardId: number) {
    let newField = this._currentQuizField;
    let card = newField.Topics.filter(x => x.Id === topicId).map(x => x.QuizCards.filter(card => card.Id === cardId)[0])[0];
    if(card) {
      let arr: Int32Array = new Int32Array([topicId, cardId])
      this.send(arr);
    }
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
