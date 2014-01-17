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
                this.scoringRepo = options.scorings;
                this.userAnswers = options.userAnswers;
                
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
            calculate: function () {

                var self = this;

                this.userAnswers.each(function (userAnswer) {

                    var results = self.scoringRepo.where(userAnswer.toJSON());
                    results.filter(function (result) {
                        if (typeof (result) != "undefined") {
                            var resultId = result.get("resultId");
                            var score = result.get("score");
                            self.addScore(resultId, score);
                        }
                    });
                });

                this.set(
                    this.getResult().toJSON()
                );

            },
            getResult: function () {

                var resultScore = this.currentScore.max(
                    function (userScore) {
                        return userScore.get("score");
                    });

                var resultDetails = this.resultRepo.findWhere({ resultId: resultScore.get("resultId") }).clone();
                
                var TotalScore = 0;
                this.scoringRepo.where({ "resultId": resultScore.get("resultId") }).filter(
                     function (result) {
                          TotalScore += result.get("score");
                      }
                );
                resultDetails.set("score", Math.floor(resultScore.get("score") * 100 / TotalScore ));

                return resultDetails;
            }

        });

        return UserResult;
    }

);