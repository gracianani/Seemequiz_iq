// Question.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Quiz = Backbone.Model.extend({
            defaults: {
                currentQuestionId: 1,
                progress: 0
            },
            initialize: function (options) {
                this.userAnswers = options.userAnswers;
                this.questions = options.questions;
                this.currentQuestion = this.questions.first();
                this.set("currentQuestionId" ,this.currentQuestion.get("questionId"));
                this.currentIndex = 0;
            },
            currentQuestionNumber: function () {
                // current question number is current index + 1
                return this.currentIndex + 1;
            },
            isFirstQuestion: function () {
                if (this.questions.first().get("questionId") == this.get("currentQuestionId")) {
                    return true;
                }
                return false;
            },
            isLastQuestion: function () {
                if (this.questions.last().get("questionId") == this.get("currentQuestionId")) {
                    return true;
                }
                return false;
            },
            isCurrentQuestionAnswered: function () {
                return this.userAnswers.isAnswered(this.get("currentQuestionId"));
            },
            goToPreviousQuestion: function () {
                var prevQuestion = this.questions.at(this.currentIndex - 1);
                this.currentQuestion = prevQuestion;
                this.currentIndex = this.currentIndex - 1;
                this.set("currentQuestionId", prevQuestion.get("questionId"));
                this.set("progress", Math.floor(this.currentIndex / this.questions.size() * 100));
            },
            goToNextQuestion: function () {
                var nextQuestion = this.questions.at(this.currentIndex + 1);
                this.currentQuestion = nextQuestion;
                this.currentIndex = this.currentIndex + 1;
                this.set("currentQuestionId", nextQuestion.get("questionId"));
                this.set("progress", Math.floor(this.currentIndex / this.questions.size() * 100));
            },
            processUserAnswer: function (answerId) {
                if (this.isCurrentQuestionAnswered()) {
                    this.userAnswers.remove(
                        this.userAnswers.where({ "questionId": this.get("currentQuestionId") })
                    );
                }
                this.userAnswers.add({ "questionId": this.get("currentQuestionId"), "answerId": answerId });
            },
            getCurrentQuestion: function () {
                var question = this.questions.get(this.get("currentQuestionId")).clone();
                question.set("answerId", this.getCurrentUserAnswerId());
                return question;
            },
            getCurrentUserAnswerId: function () {
                var answer = this.userAnswers.findWhere({ "questionId": this.get("currentQuestionId") });
                if (answer) {
                    return answer.get("answerId");
                } else {
                    return -1;
                }

            },
            getQuestionsCount: function () {
                return this.questions.size();
            },
            resetQuiz: function () {
                var questionId = this.questions.first().get("questionId");
                this.set("currentQuestionId", questionId);
                this.currentIndex = this.questions.indexOf(this.questions.findWhere({ "questionId": questionId }));
                this.set("progress", Math.floor(this.currentIndex / this.questions.size() * 100));
            }
        });

        return Quiz;
    }

);