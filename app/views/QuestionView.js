// InQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Question.html", "animationscheduler"],

    function ($, Backbone, Mustache, template, AnimationScheduler) {

        var QuestionView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#inGame-questionContainer",

            // View constructor
            initialize: function (options) {
                this.userAnswer = options.userAnswer;
                
                // Calls the view's render method
                this.listenTo(this.model, "change", this.render);
                this.listenTo(this, "render", this.postRender);
            },

            // View Event Handlers
            events: {
                "click .question-item" : "onClickQuestionItem"
            },

            // Renders the view's template to the UI
            render: function () {
                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, {});

                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(this.template, this.model.toJSON()));

                this.trigger("render");
                
                // Maintains chainability
                return this;

            },

            onClickQuestionItem: function(e) {
                this.$el.find(".question-item.selected").removeClass("selected");
                $(e.target).addClass("selected");
            },
            postRender: function() {
                var self = this;
                if ( this.model.get("answerId") > 0 ) {
                    this.$el.find("[data-id='" + this.model.get("answerId") + "']").addClass("selected");
                }
                
                this.answerItemAnimationScheduler = new AnimationScheduler(
                    this.$el.find(".question-title,.question-item"),
                    {
                        "isSequential":true,
                        "defaultEntrance":"flipInX",
                        "sequentialDelay":300
                    }
                );
                this.answerItemAnimationScheduler.animateIn(function() {
                    self.trigger("animateComplete");
                });
            }
        });

        // Returns the View class
        return QuestionView;
    }

);