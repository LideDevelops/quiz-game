namespace QuizApp.Models
{
    public class QuizCard
    {
        public string Question { get; set; }
        public string Answer { get; set; }
        public int Points { get; set; }
        public QuizCardState State { get; set; }
    }
}