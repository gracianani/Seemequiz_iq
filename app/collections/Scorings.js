// Scorings.js

define(["jquery", "backbone", "models/Scoring"],

    function ($, Backbone, Scoring) {

        var Scorings = Backbone.Collection.extend({

            url: "/app/data/scorings2.json",

            model: Scoring
        });

        return Scorings;
    }

);