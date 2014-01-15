define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
    var BackboneTouch = require("backbonetouch");
    var Questions = require("collections/Questions");
    var UserAnswers = require("collections/UserAnswers");
    var Scorings = require("collections/Scorings");
    var Results = require("collections/Results");
    var UserResult = require("models/UserResult");
    var Quiz = require("models/Quiz");

    var InQuizView = require("views/InQuizView");
    var StartQuizView = require("views/StartQuizView");
    var EndQuizView = require("views/EndQuizView");
    var MainView = require("views/MainView");

    var questions;
    var userAnswers;
    var results;
    var scorings;
    var quiz;

    var inQuizView;
    var startQuizView;
    var endQuizView;
    var mainView;

    var t;
    // Defining the application router.
    module.exports = Backbone.Router.extend({

        initialize: function () {
            startQuizView = new StartQuizView();
            mainView = new MainView();
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
            "question/:questionId": "startQuiz",
            "result": "result"
        },

        prepare: function () {
            if (questions.length !== 0) {
                clearTimeout(t);
                startQuizView.ready();
            }
        },

        index: function () {
            console.log("Welcome to your / route.");
            startQuizView.render();
            t = setTimeout(this.prepare, 1000);
        },

        startQuiz: function (questionId) {
            if (questions.isEmpty()) {
                Backbone.history.navigate('', { trigger: true, replace: true });
                return;
            }

            if (inQuizView) {
                quiz.resetQuiz(parseInt(questionId));
                inQuizView.render();
                return;
            }
            quiz = new Quiz({
                currentQuestionId: parseInt(questionId),
                questions: questions,
                userAnswers: userAnswers
            });
            inQuizView = new InQuizView({ model: quiz });
        },

        result: function () {
            if (userAnswers.length > 0) {
                endQuizView = new EndQuizView({ model: new UserResult({ results: results }), scorings: scorings, userAnswers: userAnswers });
            } else {
                Backbone.history.navigate('', { trigger: true, replace: true });
            }

        }
    });
});
