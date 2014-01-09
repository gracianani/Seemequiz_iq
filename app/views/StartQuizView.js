// StartQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/StartQuiz.html"],

    function ($, Backbone, Mustache, template) {

        var StartQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function () {

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

                // Maintains chainability
                return this;

            },
            ready: function() {
                this.$el.find('#start-action').show();
            },

            startQuiz: function () {

                Backbone.history.navigate('question/1', { trigger: true, replace: true }); 
            
            }

        });

        // Returns the View class
        return StartQuizView;
    }

);