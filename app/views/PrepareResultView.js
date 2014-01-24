define(["jquery", "backbone", "mustache", "text!templates/PrepareResult.html", "animationscheduler", "image"],

    function ($, Backbone, Mustache, template, AnimationScheduler, image) {

        var PrepareResultView = Backbone.View.extend({
            // The DOM Element associated with this view
            el: "#stage",
            initialize: function (options) {
                this.waitingTime = 5;
                this.isTimeUp = false;
                this.isPrepareFinished = false;
                
                this.userResult = options.userResult;
                
                this.listenTo(this.userResult, "change", this.prepareImages);
                this.listenTo(this, "render", this.postRender);
                
                this.render();

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
            postRender: function () {
                var self = this;
                
                this.showAd();
                this.userResult.calculate();
                
                this.$el.find("#prepare-progress-bar").animate({
                    "width":"100%"
                }, this.waitingTime * 1000, "swing", function(){
                    self.isTimeUp = true;
                    self.onPrepareFinish();
                });
            },
            prepareImages: function() {
                var firstResultImg = "image!/app/img/" + this.userResult.get("resultImageUrl");
                var secondResultImg = "image!/app/img/" + this.userResult.get("secondResultImageUrl");
                var self = this;
                require([firstResultImg, secondResultImg], function(first,second){
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
                var self = this;
                
                if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] }; }
                
                var unit = {"publisher":"gracian_ani","width":300,"height":250,"sid":"Chitika Default","color_site_link":"0000CC","color_bg":"FFFFFF"};
                
                var placement_id = window.CHITIKA.units.length;
                window.CHITIKA.units.push(unit);
                
                this.$el.find("#prepare-ad").html('<div id="chitikaAdBlock-' + placement_id + '"></div>');
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = '//cdn.chitika.net/getads.js';
                try { document.getElementsByTagName('head')[0].appendChild(s); } catch(e){
                    self.$el.find("#prepare-ad").append(s.outerHTML); 
                }

                
            }
        });

        return PrepareResultView;
    }
);