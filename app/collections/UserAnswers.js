// UserAnswers.js

define(["jquery", "backbone", "models/UserAnswer"],

    function ($, Backbone, UserAnswer) {

        var UserAnswers = Backbone.Collection.extend({

            model: UserAnswer,
            isAnswered: function(questionId) {
                return ( this.where({ "questionId": questionId }).length > 0 );
            }

        });

        return UserAnswers;
    }

);