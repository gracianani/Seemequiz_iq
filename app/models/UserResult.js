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
                this.config = options.config;

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

                this.setResult();

                //add config
                this.set(this.config.toJSON());


            },
            getResultDetailByResultId: function (resultId, resultScore) {
                var resultDetail = this.resultRepo.findWhere({ resultId: resultId }).clone();
                var TotalScore = 0;

                this.scoringRepo.where({ "resultId": resultId }).filter(
                     function (result) {
                         TotalScore += result.get("score");
                     });

                resultDetail.set("score", resultScore);

                return resultDetail;
            },
            setResult: function () {

                var sortedScore = this.currentScore.sortBy(
                    function (userScore) {
                        return userScore.get("score");
                    }
                );

                var resultId = 1;
                var highestScore = sortedScore.pop();
                var finalScore = highestScore.get("score");
                if (finalScore <= 0 || isNaN(finalScore)) {
                    resultId = 1;
                }
                else if (finalScore > 0 ) {
                    resultId = 5;
                }
                var highestDetail = this.getResultDetailByResultId(resultId, finalScore);
                this.set(highestDetail.toJSON());
            }

        });

        return UserResult;
    }

);