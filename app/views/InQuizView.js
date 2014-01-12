// InQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/InQuiz.html", "animationscheduler", "views/QuestionView"],

    function ($, Backbone, Mustache, template, AnimationScheduler, QuestionView) {

        var InQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function () {
                            
                this.listenTo(this.model, "change", this.onModelChange);
                this.listenTo(this, "render", this.postRender);

                this.render();
            },

            // View Event Handlers
            events: {

                "click #inGame-prev": "showPreviousQuestion",

                "click #inGame-next": "showNextQuestion",
                
                "click .question-item" : "onClickQuestionItem"

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
                var self = this;
                this.initQuestionView();
                this.updateProgress();
                this.updateActionButton();
                this.sceneAnimationScheduler = new AnimationScheduler($('#sceneInGame'));
                this.progressAnimationScheduler = new AnimationScheduler($('#inGame-progress-startIcon,#inGame-progress-endIcon'));
                this.actionBarAnimationScheduler = new AnimationScheduler($('#inGame-actionContainer'));
                this.sceneAnimationScheduler.animateIn(function() {
                    self.progressAnimationScheduler.animateIn(function(){
                        self.questionView.render();
                    });
                });
                this.updateActionButton();
            },
            
            showPreviousQuestion: function () {
                if (!this.model.isFirstQuestion()) {
                    this.model.goToPreviousQuestion();
                }
            },

            showNextQuestion: function () {
                if (!this.model.isLastQuestion()) {
                    this.model.goToNextQuestion();
                }
                else {
                    var self = this;
                    this.$el.find('#inGame-progress-bar').animate({'width': '99%'});
                    this.progressAnimationScheduler.animateOut(function(){
                        self.sceneAnimationScheduler.animateOut(function() {
                            Backbone.history.navigate("result", { trigger: true, replace: true }); 
                        });
                    });
                    
                }
            },
                     
            onClickQuestionItem: function(e) {
                this.model.processUserAnswer();
                this.updateActionButton();
                this.showNextQuestion();
            },
            
            onQuestionAnimateComplete: function() {

            },
            
            onModelChange: function(){
                this.updateQuestionView();
                Backbone.history.navigate('question/' + this.model.get("currentQuestionId"), { trigger: false, replace: true });
                this.updateProgress();
                this.updateActionButton();
            },
            
            updateProgress: function() {
                this.$el.find('#inGame-progress-value').html(this.model.get("currentQuestionId") + ' / ' + this.model.getQuestionsCount());
                this.$el.find('#inGame-progress-bar').animate({'width': this.model.get("progress") + '%'});
                
                if ( this.model.get("progress") > 45 ) {
                    this.$el.find('#inGame-progress-value').css('color','white');
                }
            },
            
            initQuestionView: function() {
                this.questionView = new QuestionView({ model : this.model.getCurrentQuestion() });
                this.listenTo(this.questionView, "animateComplete", this.onQuestionAnimateComplete);
            },
            
            updateQuestionView: function(){
                this.questionView.model.set( this.model.getCurrentQuestion().toJSON() );
            },
            
            updateActionButton: function(){
                var next = this.$el.find("#inGame-next");
                var prev = this.$el.find("#inGame-prev");
                
                if ( this.model.isCurrentQuestionAnswered() ) {
                    prev.show();
                    if ( this.$el.find("#inGame-actionContainer").hasClass("hidden") ) {
                        this.actionBarAnimationScheduler.animateIn();
                    }
                } else {
                    next.hide();
                }
                
                if ( this.model.isFirstQuestion() ) {
                    prev.hide();
                } else {
                    next.show();
                    if ( this.$el.find("#inGame-actionContainer").hasClass("hidden") ) {
                        this.actionBarAnimationScheduler.animateIn();
                    }
                }
                
            }
        });

        // Returns the View class
        return InQuizView;
    }

);