using System.Collections.Generic;

namespace QuizApp.Models
{
    public class QuizFieldTopic
    {
        public string TopicName { get; set; }
        public IEnumerable<QuizCard> QuizCards { get; set; }
    }
}