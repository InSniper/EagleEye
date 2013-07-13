(function () {
    'use strict';

    require.config({
        baseUrl: '/Content/',
        paths: {
            //'underscore': './lib/underscore/underscore',
            'underscore': './lib/lodash/lodash',
            'mustache': './lib/mustache/mustache',
            'json': './lib/marionette/json2',
            'jquery': './lib/jquery/jquery-1.7.2',
            'backbone': './lib/backbone/backbone',
            'backbone.marionette': './lib/backbone.marionette/backbone.marionette',
            'knockback': './lib/knockback/knockback',
            'knockout': './lib/knockback/knockout-2.2.1',
            'EEye.Base': './EEye/EEye.Base',
            'EEye.UId': './EEye/EEye.UId',
            'EEye.JQuery': './EEye/EEye.JQuery',
            'EEye.Templates': './EEye/EEye.Templates',
            'EEye.Configs': './EEye/EEye.Configs',
            'EEye.Views': './EEye/EEye.Views',
            'EEye.Models': './EEye/EEye.Models',
            'EEye.CheckBox': './EEye/EEye.CheckBox',
            'EEye.ComboBox': './EEye/EEye.ComboBox',
            'EEye.List': './EEye/EEye.List',
            'EEye.Popup': './EEye/EEye.Popup'
},
        shim: {
            'backbone': {
                deps: window.JSON ? ['underscore', 'jquery'] : ['underscore', 'jquery', 'json'],
                exports: 'Backbone'
            },
            'backbone.marionette': {
                deps: ['jquery', 'underscore', 'backbone'],
                exports: 'Marionette'
            },
            'underscore': {
                exports: '_'
            },
            'bootstrap': {
                deps: ['jquery'],
                exports: '$.fn.modal'
            },
            'jquery': {
                exports: 'jQuery'
            },
            'json': {
                exports: 'JSON'
            },
            'mocha': {
                exports: 'mocha'
            }
        }
    });
})();
