define(['backbone.marionette', 'knockback', 'EEye.Base', 'EEye.Configs', 'EEye.Templates'], function (marionette, kb, base, configs, templates) {
    'use strict';

    var views = base.namespace('EEye.Views');

    marionette.triggerMethod = (function () {

        // split the event name on the :
        var splitter = /(^|:)(\w)/gi;

        // take the event section ("section1:section2:section3")
        // and turn it in to uppercase name
        function getEventName(match, prefix, eventName) {
            return eventName.toUpperCase();
        }

        // actual triggerMethod name
        var triggerMethod = function (event) {
            // get the method name from the event name
            var methodName = 'on' + event.replace(splitter, getEventName);
            var method = this[methodName];
            if (!method) {
                 method = this['_' + methodName];
            }

            // trigger the event
            this.trigger.apply(this, arguments);

            // call the onMethodName if it exists
            if (_.isFunction(method)) {
                // pass all arguments, except the event name
                return method.apply(this, _.tail(arguments));
            }

            return;
        };

        return triggerMethod;
    })();
    
    views.View = marionette.ItemView.extend({
        constructor: function (options) {
            //var args = Array.prototype.slice.apply(arguments);

            options = this._initializeOptions(options);

            if (options.el && options.el.nodeName.toUpperCase()!=this.tagName.toUpperCase()) {
                
            }

            marionette.ItemView.prototype.constructor.call(this, options);

            this.$el.data('eeye-instance', this);
            this.$el.data('role', this.getName());
        },
        initialize: function () {
            marionette.ItemView.prototype.initialize.call(this, arguments);
        },
        _initializeOptions: function(options) {
            options = _.merge({}, this.defaultConfig, options);
            options.templateInfo = _.extend({}, configs.templateInfo, options.templateInfo);
            options.template = templates.RegisterTemplate(options.templateInfo);
            return (options);
        },
        templateHelpers: function () {
            return ({ viewId: this.cid });
        },
        getName: function () {
            return (this.registeredName);
        },
        onRender: function () {
            if (this.model) {
                var m = kb.viewModel(this.model);
                kb.applyBindings(m, this.$el[0]);
            }
        }
    });

    //views.ContainerView = marionette.ItemView.extend({
    //    constructor: function (options) {
    //        var args = Array.prototype.slice.apply(arguments);

    //        options = _.merge({}, this.defaultConfig, options);
    //        options.template = templates.RegisterTemplate(options.templateInfo);

    //        marionette.ItemView.prototype.constructor.call(this, options);
    //    },
    //    initialize: function () {
    //        marionette.ItemView.prototype.initialize.call(this, arguments);
    //    },
    //    render: function () {
    //        return(marionette.ItemView.prototype.render.call(this, arguments));
    //    },
    //    onRender: function () {
    //        _.each(this.options.templateInfo.innerViews, function (item, index) {
    //            var el;
    //            if (!item.el) {
    //                el = this.$el;
    //            }
    //            else {
    //                el = this.$el.find(item.el);
    //            }

    //            if (el && el.length) {
    //                if (!item.view && item.viewType)
    //                    item.view = this.onViewtypeFactory(item.viewType, el);
    //                if(item.view)
    //                    el.html(item.view.render().$el);
    //            }
    //        },this);
    //    },
    //    onViewtypeFactory: function (type, el) {
    //        if (type)
    //            return (new type({ collection: this.collection }));
    //        return (null);
    //    }
    //});

    views.Layout = marionette.Layout.extend({
        constructor: function (options) {
            //var args = Array.prototype.slice.apply(arguments);

            options = this._initializeOptions(options);

            marionette.ItemView.prototype.constructor.call(this, options);

            this.$el.data('eeye-instance', this);
            this.$el.data('role', this.getName());
        },
        initialize: function (options) {
            marionette.ItemView.prototype.initialize.call(this, options);
        },
        _initializeOptions: function (options) {
            options = _.merge({}, this.defaultConfig, options);
            options.templateInfo = _.extend({}, configs.templateInfo, options.templateInfo);
            options.template = templates.RegisterTemplate(options.templateInfo);
            return (options);
        },
        templateHelpers: function () {
            return ({ viewId: this.cid });
        },
        getName: function () {
            return (this.registeredName);
        },
        onRender: function () {
            if (this.model) {
                var m = kb.viewModel(this.model);
                kb.applyBindings(m, this.$el[0]);
            }
        }
    });

    views.ItemView = marionette.ItemView.extend({
        constructor: function (options) {
            //var args = Array.prototype.slice.apply(arguments);

            options = this._initializeOptions(options);

            marionette.ItemView.prototype.constructor.call(this, options);

            this.$el.data('eeye-instance', this);
            this.$el.data('role', this.getName());
        },
        initialize: function (options) {
            marionette.ItemView.prototype.initialize.call(this, options);
        },
        _initializeOptions: function (options) {
            options = _.merge({}, this.defaultConfig, options);
            options.templateInfo = _.extend({}, configs.templateInfo, options.templateInfo);
            options.template = templates.RegisterTemplate(options.templateInfo);
            return (options);
        },
        templateHelpers: function () {
            return ({ viewId: this.cid });
        },
        getName:function() {
            return (this.registeredName);
        },
        onRender: function () {
            if (this.model) {
                var m = kb.viewModel(this.model);
                kb.applyBindings(m, this.$el[0]);
            }
        }
    });

    views.CompositeView = marionette.CompositeView.extend({
        itemViewEventPrefix: 'ItemView',
        constructor: function (options) {
            //var args = Array.prototype.slice.apply(arguments);

            options = this._initializeOptions(options);

            marionette.CompositeView.prototype.constructor.call(this, options);

            this.$el.data('eeye-Instance', this);
            this.$el.data('role', this.getName());
        },
        initialize: function (options) {
            marionette.CompositeView.prototype.initialize.call(this, options);
        },
        _initializeOptions: function (options) {
            options = _.merge({}, this.defaultConfig, options);
            options.templateInfo = _.extend({}, configs.templateInfo, options.templateInfo);
            options.template = templates.RegisterTemplate(options.templateInfo);
            return (options);
        },
        templateHelpers: function () {
            return ({ viewId: this.cid });
        },
        getName:function() {
            return (this.registeredName);
        },
        onCompositeModelRendered: function () {
            if (this.model) {
                var m = kb.viewModel(this.model);
                kb.applyBindings(m, this.$el[0]);
            }
        },
        renderModel: function () {
            if (this.modelView) {
                return (new this.modelView({model:this.options.model, templateInfo: this.options.templateInfo}).render().$el);
            } else {
                return (marionette.CompositeView.prototype.renderModel.call(this));
            }
        }
    });

    //views.CollectionView = marionette.CollectionView.extend({
    //});


    return (views);
});
