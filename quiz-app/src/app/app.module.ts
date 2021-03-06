import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizeCardComponent } from './quize-card/quize-card.component';
import { QuizFieldComponent } from './quiz-field/quiz-field.component';
import { QuizTopicFieldComponent } from './quiz-topic-field/quiz-topic-field.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    QuizeCardComponent,
    QuizFieldComponent,
    QuizTopicFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
