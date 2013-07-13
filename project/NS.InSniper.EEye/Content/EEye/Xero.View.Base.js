define(['jquery', 'underscore', 'backbone', 'mustache', 'backbone.marionette', 'Xero.View'], function ($, _, Backbone, Mustache) {
    'use strict';

    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : { };

    _.extend(Backbone.Marionette.TemplateCache.prototype, {
        compileTemplate: function(rawTemplate) {
            return Mustache.compile(rawTemplate);
        }
    });

    _.extend(Marionette.TemplateCache, {
        registerTemplate: function(templateId, template) {
            var cachedTemplate = this.templateCaches[templateId];

            if (!cachedTemplate) {
                cachedTemplate = new Marionette.TemplateCache(templateId);
                this.templateCaches[templateId] = cachedTemplate;

                this.templateCaches[templateId].compiledTemplate = this.templateCaches[templateId].compileTemplate(template);
            }
        }
    });

    Xero.Views.View = Backbone.Marionette.View.extend({
        initialize: function() {
            Backbone.Marionette.View.prototype.initialize.call(this, arguments);
        }
    });

    Xero.Views.ItemView = Backbone.Marionette.ItemView.extend({
        initialize: function() {
            Backbone.Marionette.ItemView.prototype.initialize.call(this, arguments);
        }
    });

    Xero.Views.CompositeView = Backbone.Marionette.CompositeView.extend({
        options: {
            usingBinder: false,
            bindings: null
        },
        itemViewOptions: { },
        initialize: function(options) {
            var that = this;

            //this.options = _.extend({}, this.options, arguments.options);
            Backbone.Marionette.CompositeView.prototype.initialize.call(this, arguments);
            //if (this.options.usingBinder) {
            //    this.modelBinder = new Backbone.ModelBinder();
            //} else {
            //    this.model.on('change', this.render);
            //}
        },
        mixinTemplateHelpers: function (target) {
            target = target || {};
            var templateHelpers = this.templateHelpers || this.options.templateHelpers;
            if (_.isFunction(templateHelpers)) {
                templateHelpers = templateHelpers.call(this);
            }
            return _.extend(target, templateHelpers);
        },
        serializeData: function () {
            if (this.model && this.model.toJSON) {
                var data = Backbone.Marionette.CompositeView.prototype.serializeData.call(this, arguments);
                data.cid = this.model.cid;
                return (data);
            } else {
                var data = { };
                if (this.model) {
                    data = this.model;
                }
                data = this.mixinTemplateHelpers(data);

                return data;
            }
        },
        onRender: function() {
            //if (this.options.usingBinder) {
            //    this.modelBinder.bind(this.model, this.el, this.options.bindings);
            //}
        }
    });

    Xero.Views.CollectionView = Backbone.Marionette.CollectionView.extend({
        onRender: function() {
        }
    });
    

});