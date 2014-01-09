// UserResult.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var UserScoring = Backbone.Model.extend({});

        var UserScorings = Backbone.Collection.extend({
            model: UserScoring
        });

        var UserResult = Backbone.Model.extend({

            initialize: function (options) {
                this.currentScore = new UserScorings();
                this.resultRepo = options.results;
                var self = this;
                this.resultText = "";
                this.resultRepo.each(function (result) {
                    self.currentScore.add({ "resultId": result.get("resultId"), "score": 0 });
                });
            },

            addScore: function (resultId, score) {
                var oneResult = this.currentScore.findWhere({ "resultId": resultId });
                oneResult.set({ "score": oneResult.get("score") + score });
            },

            getResult: function () {
                var finalResult = this.currentScore.max(
                    function (userScore) {
                        return userScore.get("score");
                    });
                this.resultText = this.resultRepo.findWhere({ resultId: finalResult.get("resultId") }).get("resultShortDescription");
                return finalResult;
            }

        });

        return UserResult;
    }

);