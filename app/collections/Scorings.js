// Scorings.js

define(["jquery", "backbone", "models/Scoring"],

    function ($, Backbone, Scoring) {

        var cryto = require("cipher");

        var Scorings = Backbone.Collection.extend({

            url: function () {
                return "app/data/enciphered-scorings.json";
            },

            parse: function (response) {
                var deciphered = { stream: { value: response.a }, key: { value: 'adegr'} };
                var parsed = decipher(deciphered);
                return JSON.parse(deciphered.stream.value);
            },

            model: Scoring
        });

        return Scorings;
    }

);