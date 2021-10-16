using QuizApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Subjects;
using System.Threading.Tasks;

namespace QuizApp.Logic
{
    public class FieldLogic : IFieldLogic
    {
        private static QuizFieldState currentQuizFieldState = null;
        private static Subject<Tuple<int, int, QuizCardState>> FieldChanged = new Subject<Tuple<int, int, QuizCardState>>();
        public QuizFieldState GetCurrentQuizField()
        {
            return currentQuizFieldState;
        }

        public void SetupNewQuizField(IEnumerable<QuizFieldTopic> topics)
        {
            if (!ValidateTopics(topics))
            {
                topics = ModifyCardIds(topics);
            }
            currentQuizFieldState = new QuizFieldState()
            {
                Topics = topics
            };

            foreach (var topic in topics.Select((x, i) => new { Topic = x, Id = i }))
            {
                foreach (var card in topic.Topic.QuizCards.Select((x, i) => new { Card = x, Id = i }))
                {
                    card.Card.OnStateChange.Subscribe(x => FieldChanged.OnNext(new Tuple<int, int, QuizCardState>(topic.Id, card.Id, x)));
                }
            }
        }

        private IEnumerable<QuizFieldTopic> ModifyCardIds(IEnumerable<QuizFieldTopic> topics)
        {
            return topics.Select((topic, indexTopic) => new QuizFieldTopic
            {
                QuizCards = topic.QuizCards.Select((card, indexField) => new QuizCard
                {
                    Answer = card.Answer,
                    Id = indexField,
                    Points = card.Points,
                    Question = card.Question,
                    State = card.State
                }),
                Id = indexTopic,
                TopicName = topic.TopicName
            });
        }

        /// <summary>
        /// Verify that every ID is only there once
        /// </summary>
        /// <param name="topics"></param>
        /// <returns></returns>
        private bool ValidateTopics(IEnumerable<QuizFieldTopic> topics)
        {
            return !(topics.SelectMany(x => x.QuizCards).GroupBy(x => x.Id).Where(x => x.Count() > 1).Any()
                || topics.GroupBy(x => x.Id).Where(x => x.Count() > 1).Any());
        }

        public void ChangeStateOfQuizCardToNext(int topicId, int cardId)
        {
            var card = currentQuizFieldState.Topics.Where(x => x.Id == topicId).SelectMany(x => x.QuizCards).Where(x => x.Id == cardId).FirstOrDefault();
            if (card == null)
            {
                return;
            }
            switch (card.State)
            {
                case QuizCardState.answer:
                    card.State = QuizCardState.pointDisplay;
                    break;
                case QuizCardState.pointDisplay:
                    card.State = QuizCardState.question;
                    break;
                case QuizCardState.question:
                    card.State = QuizCardState.answer;
                    break;
                default:
                    card.State = QuizCardState.pointDisplay;
                    break;
            }
        }

        public IObservable<Tuple<int, int, QuizCardState>> OnQuizCardUpdate()
        {
            return FieldChanged;
        }
    }
}
