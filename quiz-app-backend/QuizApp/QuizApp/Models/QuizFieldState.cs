using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuizApp.Models
{
    public class QuizFieldState
    {
        public IEnumerable<QuizFieldTopic> Topics { get; set; }
    }
}
