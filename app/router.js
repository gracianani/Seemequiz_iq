define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
    var BackboneTouch = require("backbonetouch");
    var Cipher = require("cipher");
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
            results = new Results();
            userAnswers = new UserAnswers();
            scorings = new Scorings();

            var self = this;
            this.fetchSuccessCount = 0;
            var fetchSuccessHandler = function () {
                self.fetchSuccessCount++;
                if (self.fetchSuccessCount == 3) {
                    self.prepare();
                }
            };
            questions.fetch({
                success: fetchSuccessHandler
            });
            results.fetch({
                success: fetchSuccessHandler
            });
            scorings.fetch({
                success: fetchSuccessHandler
                /*
                success: function () {
                for (var resultId = 1; resultId < results.length + 1; resultId++) {
                var score = 0;
                scorings.where({ "resultId": resultId }).filter(
                function (result) {
                score += result.get("score");
                }
                );
                console.log("result" + resultId + ",score" + score);
                }
                }*/
            });

        },

        routes: {
            "": "index",
            "question/:questionId": "startQuiz",
            "result": "result"
        },

        prepare: function () {
            startQuizView.ready();
        },

        index: function () {
            console.log("Welcome to your / route.");
            startQuizView.render();
            if (!(questions.isEmpty() || results.isEmpty() || scorings.isEmpty())) {
                this.prepare();
            }
        },

        startQuiz: function (questionId) {
            if (questions.isEmpty()) {
                Backbone.history.navigate('', { trigger: true, replace: true });
                return;
            }

            if (inQuizView) {
                quiz.resetQuiz();
                inQuizView.render();
                return;
            }
            quiz = new Quiz({
                questions: questions,
                userAnswers: userAnswers
            });
            inQuizView = new InQuizView({ model: quiz });
        },

        result: function () {
            if (userAnswers.length > 0) {
                endQuizView = new EndQuizView({ model: new UserResult({ results: results, scorings: scorings, userAnswers: userAnswers }) });
            } else {
                Backbone.history.navigate('', { trigger: true, replace: true });
            }

        }
    });
});
