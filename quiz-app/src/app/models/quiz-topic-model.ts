import { QuizCardModel } from "./quiz-card-model";

export interface QuizTopicModel {
  topicName: string,
  quizCards: QuizCardModel[]
}
