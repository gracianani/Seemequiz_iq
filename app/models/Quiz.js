// Question.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Quiz = Backbone.Model.extend({
            defaults: {
                currentQuestionId:1,
                progress:0
            },
            initialize: function(options){
                this.userAnswers = options.userAnswers;
                this.questions = options.questions;
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
            isCurrentQuestionAnswered: function() {
                return this.userAnswers.isAnswered( this.get("currentQuestionId") );
            },
            goToPreviousQuestion: function(){
                this.set("currentQuestionId", this.get("currentQuestionId") - 1 );
                this.set("progress",  Math.floor(( this.get("currentQuestionId") - 1 ) / this.questions.size() * 100 ));
            },
            goToNextQuestion: function(){
                this.set("currentQuestionId", this.get("currentQuestionId") + 1 );
                this.set("progress",  Math.floor(( this.get("currentQuestionId") - 1 ) / this.questions.size() * 100 ));
            },
            processUserAnswer: function ( answerId ) {
                if (this.isCurrentQuestionAnswered()) {
                    this.userAnswers.remove( 
                        this.userAnswers.where({ "questionId": this.get("currentQuestionId") })
                    );
                }
                this.userAnswers.add({ "questionId": this.get("currentQuestionId"), "answerId": 1 });
                console.log(this.userAnswers.toJSON());
            },
            getCurrentQuestion: function() {
                var question = this.questions.get( this.get("currentQuestionId") ).clone();
                question.set("answerId", this.getCurrentUserAnswerId());
                return question;
            },
            getCurrentUserAnswerId: function(){
                var answer = this.userAnswers.findWhere({ "questionId": this.get("currentQuestionId") });
                if ( answer ) {
                    return answer.get("answerId"); 
                } else {
                    return -1;
                }
                
            },
            getQuestionsCount: function(){
                return this.questions.size();
            },
            resetQuiz: function(questionId) {
                this.set("currentQuestionId", questionId);
                this.set("progress",  Math.floor(( this.get("currentQuestionId") - 1 ) / this.questions.size() * 100 ));
            }
        });

        return Quiz;
    }

);