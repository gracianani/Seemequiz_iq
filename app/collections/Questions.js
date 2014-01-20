// Questions.js

define(["jquery", "backbone", "models/Question" ],

    function ($, Backbone, Question, Data) {

        var Questions = Backbone.Collection.extend({

            url: "/app/data/questions.json",

            model: Question

        });

        return Questions;
    }

);