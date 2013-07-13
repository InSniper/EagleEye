define(['jquery', 'underscore', 'backbone', 'mustache'], function ($, _, Backbone, Mustache) {
    'use strict';
    window.Xero = window.Xero ? window.Xero : { };
    window.Xero.Models = window.Xero.Models ? window.Xero.Models : { };
    window.Xero.Defaults = window.Xero.Defaults ? window.Xero.Defaults : { };

    window.Xero.Defaults.TakeMax = 100;
    window.Xero.Defaults.Take = 20;
    window.Xero.Defaults.Skip = 0;
});
