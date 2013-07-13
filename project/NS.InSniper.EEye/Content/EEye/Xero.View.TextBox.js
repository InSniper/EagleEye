define(['jquery', 'underscore', 'backbone', 'mustache', 'Xero.View.Base', 'jquery.numeric'], function ($, _, Backbone, Mustache) {
    'use strict';

    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : {};

    Xero.Views.TextBox = Xero.Views.View.extend({
        tagName: "div",
        className: 'positionRelative',
        options: {
            placeholder: '...',
            delay: 500,
            minLength: 0,
            //type: 'text',
            showClearInputBtn: false,
            classes: [],
            maxlength: 100,    // the maximum number of characters the user is allowed to enter
            isNumeric: false
        },
        events: {
            'keyup': function (e) {
                if (e.target.value.length >= this.options.minLength) {
                    this._setTimer();
                } else {
                    this._clearTimer();
                }
            },
            'keydown': function (e) {
                this._clearTimer();
            },

            'click #clear-search-query': function () {
                this.input.val('');
                this._raiseReadyEvent();
            }
        },
        initialize: function (options) {
            options = options || {};
            Xero.Views.View.prototype.initialize.call(this, arguments);
        },
        _clearTimer: function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
        _setTimer: function () {
            this._clearTimer();
            this.timer = setTimeout(_.bind(this._raiseReadyEvent, this), this.options.delay);
        },
        render: function () {
            var self = this;
            Xero.Views.View.prototype.render.call(this, arguments);
            this.input = $('<input>', {
                id: this.options.id || 'search-query',
                type: 'text', //this.options.type, -- should always be text
                placeholder: this.options.placeholder,
                maxlength: this.options.maxlength,
                value: this.options.value || ""
            });

            _.each(self.options.classes, function (c) {
                self.input.addClass(c);
            });

            this.$el.html(this.input);

            if (this.options.showClearInputBtn) {
                self.ClearInputButton = '<img id="clear-search-query" class="pointer" src=' + Xero.UrlFactory("BossContent/Images/clear.PNG") + ' alt="Cancel topic selection" style= "position:absolute;right:5px;top:5px;"/>';
                this.input.after(self.ClearInputButton);
                this.input.css('padding-right', '28px');
            }

            if (this.options.isNumeric) this.input.numeric();

            return (this);
        },
        _raiseReadyEvent: function () {
            this.trigger('xEventValueReady', this);
        },
        getValue: function () {
            return (this.input.val());
        },
        setValue: function(data) {
            this.input.val(data);
        }
    });
});