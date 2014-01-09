// UserAnswers.js

define(["jquery", "backbone", "models/UserAnswer"],

    function ($, Backbone, UserAnswer) {

        var UserAnswers = Backbone.Collection.extend({

            model: UserAnswer

        });

        return UserAnswers;
    }

);