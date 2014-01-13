define(["jquery", "backbone", "mustache", "text!templates/InQuiz.html", "animationscheduler", "views/QuestionView"],

    function ($, Backbone, Mustache, template, AnimationScheduler, QuestionView) {

        var InQuizView = Backbone.View.extend({

            initialize: function () {
                this.waitingTime = 10;

            }
        });

        return InQuizView;
    }
);