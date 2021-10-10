﻿using NSubstitute;
using QuizApp.Logic;
using QuizApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace QuizAppTests.Logic
{
    public class FieldLogicTests
    {


        public FieldLogicTests()
        {

        }

        private FieldLogic CreateFieldLogic()
        {
            return new FieldLogic();
        }

        [Fact]
        public void SetupNewQuizField_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var fieldLogic = this.CreateFieldLogic();
            IEnumerable<QuizFieldTopic> topics = new QuizFieldTopic[]
            {
                new QuizFieldTopic()
                {
                    QuizCards = new QuizCard[]
                    {
                        new QuizCard
                        {
                            Id = 1
                        },
                        new QuizCard
                        {
                            Id = 2
                        }

                    }
                }
            };

            // Act
            fieldLogic.SetupNewQuizField(topics);
            var result = fieldLogic.GetCurrentQuizField();


            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Topics.First().QuizCards.First().Id);
        }

        [Fact]
        public void SetupNewQuizField_StateUnderTest_IDsNotSet()
        {
            // Arrange
            var fieldLogic = this.CreateFieldLogic();
            IEnumerable<QuizFieldTopic> topics = new QuizFieldTopic[]
            {
                new QuizFieldTopic()
                {
                    QuizCards = new QuizCard[]
                    {
                        new QuizCard
                        {
                        },
                        new QuizCard
                        {
                        }

                    }
                }
            };

            // Act
            fieldLogic.SetupNewQuizField(topics);
            var result = fieldLogic.GetCurrentQuizField();


            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.Topics.First().QuizCards.First().Id);
            Assert.Equal(1, result.Topics.First().QuizCards.Skip(1).First().Id);
        }
    }
}
