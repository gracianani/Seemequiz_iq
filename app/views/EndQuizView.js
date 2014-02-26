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
                _hmt.push(['_trackPageview', '/result']);

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
                
                var title = this.model.get("resultShareText") + "—" + this.model.get("resultName") + ": 「" + this.model.get("resultShortDescription") + "」 " +this.model.get("scoreName") +this.model.get("score") + "," + this.model.get("resutlShareTextEnd");
                $('title').text(title);
                
                this.showAd();
            },
            restartQuiz: function () {
                $("#main").css("height","100%");
                
                $('title').text(this.model.get("defaultShareText"));
                Backbone.history.navigate('', { trigger: true, replace: true });
            },
            showAd: function() {
                var self = this;
                var placeHolder = this.$el.find("#endQuizAd");
                var tanx_s = document.createElement('script');
                tanx_s.src = 'http://ads1.qadabra.com/t?id=a02b6e08-e724-4844-af55-41aafb13965e&size=300x250';
                tanx_s.type = 'text/javascript';

                if (!document._write) document._write = document.write;
                document.write = function (str) {
                    if (str.indexOf("SCRIPT") >= 0) {
                        var matches = str.match(/SRC=".+"/);
                        for (var index = 0; index < matches.length; index++) {
                            var src = matches[index].replace("SRC=\"", "").replace("\"", "");
                            tanx_s.src = src;
                            tanx_s.type = 'text/javascript';
                            placeHolder.append(tanx_s);
                        }
                    }
                    else {
                        placeHolder.append(str)
                    }
                };
                placeHolder.append(tanx_s);
            }

        });

        // Returns the View class
        return EndQuizView;
    }

);