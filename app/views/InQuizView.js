// InQuizView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/InQuiz.html", "animationscheduler", "views/QuestionView"],

    function ($, Backbone, Mustache, template, AnimationScheduler, QuestionView) {

        var InQuizView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#stage",

            // View constructor
            initialize: function (options) {
                var self = this;
                this.questionRepo = options.questions;
                this.userAnswers = options.userAnswers;
                this.currentQuestionId = options.questionId;
                
                //this.listenTo(this.model, "change", this.render);
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
                this.sceneAnimationScheduler = new AnimationScheduler($('#sceneInGame'));
                this.sceneAnimationScheduler.animateIn(function() {
                    self.updateQuestionView();
                });
            },
            showPreviousQuestion: function () {
                if (!this.isFirstQuestion()) {
                    this.currentQuestionId--;
                    this.updateQuestionView();
                    Backbone.history.navigate('question/' + this.currentQuestionId, { trigger: false, replace: true });
                }
            },

            showNextQuestion: function () {
                if (!this.isLastQuestion()) {
                    this.currentQuestionId++;
                    this.updateQuestionView();
                    Backbone.history.navigate('question/' + this.currentQuestionId, { trigger: false, replace: true });
                }
                else {
                    Backbone.history.navigate('result', { trigger: true, replace: true });
                }
            },

            processUserAnswer: function () {
                if (this.userAnswers.isAnswered(this.currentQuestionId)) {
                    this.userAnswers.remove( this.userAnswers.where({ "questionId": this.currentQuestionId }));
                }
                this.userAnswers.add({ "questionId": this.currentQuestionId, "answerId": 1 });
                console.log(this.userAnswers.toJSON());
            },

            isFirstQuestion: function () {
                if (this.questionRepo.first().get("questionId") == this.currentQuestionId) {
                    return true;
                }
                return false;
            },

            isLastQuestion: function () {
                if (this.questionRepo.last().get("questionId") == this.currentQuestionId) {
                    return true;
                }
                return false;
            },
            onClickQuestionItem: function() {
                this.processUserAnswer();
                this.updateActionButton();
            },
            onQuestionAnimateComplete: function() {
                this.$el.find("#inGame-actionContainer").removeClass("hidden");
            },
            updateProgress: function() {
                var percent = 10;
                if ( this.userAnswers && this.questionRepo && this.questionRepo.size() ) {
                    percent = Math.floor( ( ( this.userAnswers.length + 1 ) / this.questionRepo.size() ) * 100 );
                }
                
                this.$el.find('#inGame-progress-value').html(percent + '%');
                this.$el.find('#inGame-progress-bar').css('width', percent + '%');
                
                if ( percent > 45 ) {
                    this.$el.find('#inGame-progress-value').css('color','white');
                }
            },
            updateQuestionView: function(){
                var question = this.questionRepo.get(this.currentQuestionId);
                if ( !this.questionView ) {
                    this.questionView = new QuestionView({ model : question.clone() });
                    this.listenTo(this.questionView, "animateComplete", this.onQuestionAnimateComplete);
                    this.questionView.render();
                } else {
                    this.questionView.model.set(question.toJSON());
                }
                
                this.updateProgress();
                this.$el.find("#inGame-actionContainer").addClass("hidden");
                this.updateActionButton();
            },
            updateActionButton: function(){
                if ( this.userAnswers.isAnswered(this.currentQuestionId) ) {
                    this.$el.find("#inGame-next").show();
                } else {
                    this.$el.find("#inGame-next").hide();
                }
                
                if ( this.isFirstQuestion() ) {
                    this.$el.find("#inGame-prev").hide();
                } else {
                    this.$el.find("#inGame-prev").show();
                }
            }
        });

        // Returns the View class
        return InQuizView;
    }

);