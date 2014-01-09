define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");

    var Questions = require("collections/Questions");
    var UserAnswers = require("collections/UserAnswers");
    var Scorings = require("collections/Scorings");
    var Results = require("collections/Results");
    var UserResult = require("models/UserResult");

    var InQuizView = require("views/InQuizView");
    var StartQuizView = require("views/StartQuizView");
    var EndQuizView = require("views/EndQuizView");

    var questions;
    var userAnswers;
    var results;
    var scorings;

    var inQuizView;
    var startQuizView;
    var endQuizView;

    var t;
    // Defining the application router.
    module.exports = Backbone.Router.extend({

        initialize: function () {
            startQuizView = new StartQuizView();
            questions = new Questions();
            questions.fetch();
            results = new Results();
            results.fetch();
            userAnswers = new UserAnswers();
            scorings = new Scorings();
            scorings.fetch();
        },

        routes: {
            "": "index",
            "question/:questionId": "quiz",
            "result": "result"
        },

        prepare: function () {
            if (questions.length !== 0) {
                clearTimeout(t);
                startQuizView.render();
            }
        },

        index: function () {
            console.log("Welcome to your / route.");
            t = setTimeout(this.prepare, 1000);
        },

        quiz: function (questionId) {
            inQuizView = new InQuizView({ model: questions.get(questionId), questions: questions, userAnswers: userAnswers });
        },

        result: function () {
            endQuizView = new EndQuizView({ model: new UserResult({ results: results }), scorings: scorings, userAnswers: userAnswers });
        }
    });
});
