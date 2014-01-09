define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");
	var BackboneTouch = require("backbonetouch");
	var AnimationHandler = require("animationhandler");
    var Questions = require("collections/Questions");
    var UserAnswers = require("collections/UserAnswers");
    var Scorings = require("collections/Scorings");
    var Results = require("collections/Results");
    var UserResult = require("models/UserResult");

    var InQuizView = require("views/InQuizView");
    var StartQuizView = require("views/StartQuizView");
    var EndQuizView = require("views/EndQuizView");
    var MainView = require("views/MainView");

    var questions;
    var userAnswers;
    var results;
    var scorings;

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
            "question/:questionId": "quiz",
            "result": "result"
        },

        prepare: function () {
            if (questions.length !== 0) {
                clearTimeout(t);
                
            }
        },

        index: function () {
            console.log("Welcome to your / route.");
            startQuizView.render();
            t = setTimeout(this.prepare, 1000);
        },

        quiz: function (questionId) {
            if ( !questions || questions.size() < 1 ) {
                Backbone.history.navigate('', { trigger: true, replace: true });
                return;
            }
            inQuizView = new InQuizView({ model: questions.get(questionId).clone(), questions: questions, userAnswers: userAnswers });
        },

        result: function () {
            endQuizView = new EndQuizView({ model: new UserResult({ results: results }), scorings: scorings, userAnswers: userAnswers });
        }
    });
});
