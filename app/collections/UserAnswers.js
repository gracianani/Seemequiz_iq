// UserAnswers.js

define(["jquery", "backbone", "models/UserAnswer"],

    function ($, Backbone, UserAnswer) {

        var UserAnswers = Backbone.Collection.extend({

            model: UserAnswer,
            isAnswered: function(questionId) {
                var answersCount = this.where({ "questionId": questionId }).length;
                return ( answersCount > 0 );
            }

        });

        return UserAnswers;
    }

);