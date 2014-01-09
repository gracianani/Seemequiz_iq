// Result.js

define(["jquery", "backbone"],

    function ($, Backbone) {

        var Result = Backbone.Model.extend({

            idAttribute: "questionId"

        });

        return Result;
    }

);