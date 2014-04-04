define(["jquery", "backbone", "mustache", "text!templates/PrepareResult.html", "animationscheduler", "image"],

    function ($, Backbone, Mustache, template, AnimationScheduler, image) {

        var PrepareResultView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#stage",
            initialize: function (options) {
                this.waitingTime = this.model.get("preparingTime");
                this.isTimeUp = false;
                this.isPrepareFinished = false;
                
                this.userResult = options.userResult;
                
                this.listenTo(this.userResult, "change", this.prepareImages);
                this.listenTo(this, "render", this.postRender);
                _hmt.push(['_trackPageview', '/prepare']);
                this.render();

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
                
                this.showAd();
                this.userResult.calculate();
                
                this.$el.find("#prepare-progress-bar").animate({
                    "width":"100%"
                }, this.waitingTime, "swing", function(){
                    self.isTimeUp = true;
                    self.onPrepareFinish();
                });
            },
            prepareImages: function() {
                var firstResultImg = "image!app/img/" + this.userResult.get("resultImageUrl");
                var self = this;
                require([firstResultImg], function(first){
                    self.isPrepareFinished = true;
                    self.onPrepareFinish();
                });
                
            },
            onPrepareFinish: function() {
                if ( this.isPrepareFinished && this.isTimeUp ) {
                    this.trigger("prepareFinish");
                }
            },
            showAd: function() {
            }
        });

        return PrepareResultView;
    }
);