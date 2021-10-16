using Newtonsoft.Json;
using System;
using System.Reactive.Subjects;

namespace QuizApp.Models
{
    public class QuizCard
    {
        private QuizCardState currentState;
        private ISubject<QuizCardState> stateSubject;

        public string Question { get; set; }
        public string Answer { get; set; }
        public int Points { get; set; }
        public QuizCardState State 
        { 
            get 
            {
                return currentState;
            }

            set 
            {
                stateSubject.OnNext(value);
            } 
        }

        [JsonIgnore]
        public IObservable<QuizCardState> OnStateChange 
        { 
            get
            {
                return stateSubject;
            }
        }

        public long Id { get; set; }

        public QuizCard()
        {
            stateSubject = new Subject<QuizCardState>();
            stateSubject.Subscribe(x => currentState = x);
        }
    }
}