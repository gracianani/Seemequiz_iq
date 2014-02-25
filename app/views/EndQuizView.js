// EndQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/EndQuiz.html", "animationscheduler"],

    function ($, Backbone, Mustache, template, AnimationScheduler) {

        var EndQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {

                this.prepareResultView = options.prepareResultView;

                // Calls the view's render method
                this.listenTo(this.prepareResultView, "prepareFinish", this.render);

                this.listenTo(this, "render", this.postRender);

            },

            // View Event Handlers
            events: {

                "click #result-restart": "restartQuiz",
                "click #quick-restart": "restartQuiz"

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
            postRender: function () {
                var self = this;
                this.stageAnimationScheduler = new AnimationScheduler(this.$el.find(".result-name-title, .result-name, .result-img img,.result-quote"), {
                    isSequential: true
                });
                this.buttonAnimationScheduler = new AnimationScheduler(this.$el.find("#quick-share,#quick-restart, .result-score"));

                this.stageAnimationScheduler.animateIn(function () {
                    self.buttonAnimationScheduler.animateIn();
                });
                
                var title = "我被发现有" + this.model.get("score") + "%的嫌疑是" + this.model.get("resultName") + "！你会是哪位超级英雄呢？";
                $('title').text(title);
            },
            restartQuiz: function () {
                var title = "你最像哪位超级英雄? Heroes, assemble！【性格测试】";
                $('title').text(title);
                Backbone.history.navigate('', { trigger: true, replace: true });
            }

        });

        // Returns the View class
        return EndQuizView;
    }

);