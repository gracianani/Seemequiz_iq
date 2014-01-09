// InQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/InQuiz.html"],

    function ($, Backbone, Mustache, template) {

        var InQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {

                this.questionRepo = options.questions;

                this.userAnswers = options.userAnswers;

                // Calls the view's render method
                this.listenTo(this.model, "change", this.render);

                this.render();
            },

            // View Event Handlers
            events: {

                "click #inGame-prev": "showPreviousQuestion",

                "click #inGame-next": "showNextQuestion"

            },

            // Renders the view's template to the UI
            render: function () {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, {});

                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));

                // Maintains chainability
                return this;

            },

            showPreviousQuestion: function () {
                if (!this.isFirstQuestion()) {
                    this.model.set(this.questionRepo.get(this.model.id - 1).toJSON());
                    Backbone.history.navigate('question/' + this.model.id, { trigger: false, replace: true });
                }
            },

            showNextQuestion: function () {
                this.processUserAnswer();
                if (!this.isLastQuestion()) {
                    this.model.set(this.questionRepo.get(this.model.id + 1).toJSON());
                    Backbone.history.navigate('question/' + this.model.id, { trigger: false, replace: true });
                }
                else {
                    Backbone.history.navigate('result', { trigger: true, replace: true });
                }
            },

            processUserAnswer: function () {
                if (this.userAnswers.where({ "questionId": this.model.id }).length > 0) {
                    this.userAnswers.remove(this.userAnswers.where({ "questionId": this.model.id }));
                }
                this.userAnswers.add({ "questionId": this.model.id, "answerId": 1 });
                console.log(this.userAnswers.toJSON());
            },

            isFirstQuestion: function () {
                if (this.questionRepo.first().get("questionId") == this.model.id) {
                    return true;
                }
                return false;
            },

            isLastQuestion: function () {
                if (this.questionRepo.last().get("questionId") == this.model.id) {
                    return true;
                }
                return false;
            }
        });

        // Returns the View class
        return InQuizView;
    }

);