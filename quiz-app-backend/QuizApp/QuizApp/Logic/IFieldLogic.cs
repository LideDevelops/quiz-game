using QuizApp.Models;
using System;
using System.Collections.Generic;

namespace QuizApp.Logic
{
    public interface IFieldLogic
    {
        void ChangeStateOfQuizCardToNext(int topicId, int cardId);
        QuizFieldState GetCurrentQuizField();
        IObservable<Tuple<int, int, QuizCardState>> OnQuizCardUpdate();
        void SetupNewQuizField(IEnumerable<QuizFieldTopic> topics);
    }
}