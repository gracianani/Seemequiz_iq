// StartQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/StartQuiz.html", "animationscheduler"],

    function ($, Backbone, Mustache, template, AnimationScheduler) {

        var StartQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function () {
                this.listenTo(this, "render", this.postRender);
            },

            // View Event Handlers
            events: {

                "click #start-startButton": "startQuiz"

            },

            // Renders the view's template to the UI
            render: function () {
                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, {});

                // Dynamically updates the UI with the view's template
                this.$el.html(Mustache.render(this.template));
                
                this.trigger("render");
                
                // Maintains chainability
                return this;

            },
            postRender: function() {
                this.sceneAnimationScheduler = new AnimationScheduler(this.$el.find("#start-cover"));
                this.buttonAnimationScheduler = new AnimationScheduler(this.$el.find("#start-startButton,#start-shareButton"), {"isSequential":true});
                
                this.sceneAnimationScheduler.animateIn();
            },
            ready: function() {
                var self = this;
                this.$el.find(".loading").removeClass("loading");
                this.buttonAnimationScheduler.animateIn();
            },

            startQuiz: function () {
                Backbone.history.navigate("question/2", { trigger: true, replace: true });
            }

        });

        // Returns the View class
        return StartQuizView;
    }

);