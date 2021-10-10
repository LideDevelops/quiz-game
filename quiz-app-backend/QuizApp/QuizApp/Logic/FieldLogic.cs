using QuizApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizApp.Logic
{
    public class FieldLogic
    {
        private static QuizFieldState currentQuizFieldState = null;
        public QuizFieldState GetCurrentQuizField()
        {
            return currentQuizFieldState;
        }

        public void SetupNewQuizField(IEnumerable<QuizFieldTopic> topics)
        {
            if(!ValidateTopics(topics))
            {
                topics = ModifyCardIds(topics);
            }
            currentQuizFieldState = new QuizFieldState()
            {
                Topics = topics
            };
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
    }
}
