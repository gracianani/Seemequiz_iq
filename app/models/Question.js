// Question.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Question = Backbone.Model.extend({

            idAttribute: "questionId"

        });

        return Question;
    }

);