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
                
                this.setResult();


            },
            getResultDetailByResultId: function( resultId, resultScore ) {
                var resultDetail = this.resultRepo.findWhere({ resultId:resultId }).clone();
                var TotalScore = 0;
                
                this.scoringRepo.where({ "resultId": resultId }).filter(
                     function (result) {
                          TotalScore += result.get("score");
                });
                
                resultDetail.set("score", Math.floor(resultScore * 100 / TotalScore ));
                
                return resultDetail;
            },
            setResult: function () {

                var sortedScore = this.currentScore.sortBy(
                    function(userScore) {
                        return userScore.get("score");
                    }
                );
                
                //get top 2 score
                var highestScore = sortedScore.pop();
                var secondHighestResult = sortedScore.pop();
                
                var highestDetail = this.getResultDetailByResultId( highestScore.get("resultId"), highestScore.get("score") );
                var secondHighestDetail = this.getResultDetailByResultId( secondHighestResult.get("resultId"), secondHighestResult.get("score") );
                
                //merge results
                highestDetail.set("secondResultId", secondHighestDetail.get("resultId"));
                highestDetail.set("secondResultName", secondHighestDetail.get("resultName"));
                highestDetail.set("secondResultImageUrl", secondHighestDetail.get("resultImageUrl"));
                highestDetail.set("secondScore", secondHighestDetail.get("score"));
                
                this.set( highestDetail.toJSON() );
            }

        });

        return UserResult;
    }

);