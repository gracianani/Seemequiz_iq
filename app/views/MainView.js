// ToolbarView.js
// -------
define(["jquery", "backbone","animationscheduler"],

    function ($, Backbone, AnimationScheduler) {

        var MainView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#main",

            // View constructor
            initialize: function (options) {
                this.disableSelection();
                this.helpButtonAnimationScheduler = new AnimationScheduler( this.$el.find("#topBar-help") );
                this.helpButtonAnimationScheduler.animateIn();
            },

            // View Event Handlers
            events: {
                "click #logo": "onClickLogo"
            },

            onClickLogo: function() {
                Backbone.history.navigate('', { trigger: true, replace: true });
            },
            disableSelection: function() {
                this.$el.css({
                    'MozUserSelect':'none',
                    'webkitUserSelect':'none'
                    }).attr('unselectable','on').bind('selectstart', function(event) {
                    event.preventDefault();
                    return false;
                });
            }
        });

        // Returns the View class
        return MainView;
    }

);