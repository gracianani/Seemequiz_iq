// EndQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/EndQuiz.html"],

    function ($, Backbone, Mustache, template) {

        var EndQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {

                this.scoringRepo = options.scorings;

                this.userAnswers = options.userAnswers;

                // Calls the view's render method
                this.listenTo(this.model, "change", this.render);

                this.calculate();
            },

            calculate: function () {

                var self = this;

                this.userAnswers.each(function (userAnswer) {
                    var result = self.scoringRepo.findWhere(userAnswer.toJSON());
                    if (typeof (result) != "undefined") {
                        var resultId = result.get("resultId");
                        var score = result.get("score");
                        self.model.addScore(resultId, score);
                    }
                });

                this.model.getResult();

                this.model.set({
                    "resultText": this.model.resultText
                }); 
            },

            // View Event Handlers
            events: {

                "click #btn-previous": "showPreviousQuestion",

                "click #btn-next": "showNextQuestion"

            },

            // Renders the view's template to the UI
            render: function () {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, {});

                console.log(this.model.toJSON());
                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));

                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return EndQuizView;
    }

);