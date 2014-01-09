// Results.js

define(["jquery", "backbone", "models/Result"],

    function ($, Backbone, Result, Data) {

        var Results = Backbone.Collection.extend({

            url: "/app/data/results.json",

            model: Result

        });

        return Results;
    }

);