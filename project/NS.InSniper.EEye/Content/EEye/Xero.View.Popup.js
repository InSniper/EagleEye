define(['jquery', 'underscore', 'backbone', 'mustache', 'Xero.View.Base'], function ($, _, Backbone, Mustache) {
    'use strict';

    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : {};

    Xero.Views.Popup = Xero.Views.View.extend({
        tagName: "input",
        options: {
            placeholder: '...',
            delay: 500,
            minLength: 0,
            type: 'text'
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
            }
        },
        initialize: function (options) {
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
            Xero.Views.View.prototype.render.call(this, arguments);
            this.$el.attr('placeholder', this.options.placeholder);
            this.$el.attr('type', this.options.type);
            this.$el.attr('id', this.options.id);
            return (this);
        },
        _raiseReadyEvent: function () {
            this.trigger('xEventValueReady', this);
        },
        getValue: function () {
            return (this.$el.val());
        }
    });


});



//Xero.Views.PopupLink = Xero.Views.ViewBase.extend({
//    xeroOptions: {
//        headerText: 'Header',
//        buttons: [{ text: 'Ok', event: 'ok', id: 'xeroModalOKButton', class: 'btn btn-primary ok', IsAutoClose: true }, { text: 'Cancel', event: 'cancel', id: 'boss-btn cancel', class: 'boss-btn cancel', IsAutoClose: true }],
//        id: 'PopupLink',
//        generateHyperLink: false,
//        generateHyperLinkText: 'Select',
//        generateHyperLinkClass: 'btn btn-primary',
//        isAnimate: true,
//        content: null,
//        modalClass: '',
//        fullscreen: false,
//        fullscreenMargins: [20, 20],
//        position: [200, 200],
//        minWidth: 0
//    },
//    initialize: function (args) {

//        this.template = '{{#generateHyperLink}}<a data-target="#{{id}}" role="button" class="{{generateHyperLinkClass}}" data-toggle="modal">{{generateHyperLinkText}}</a>\n{{/generateHyperLink}}';
//        this.templatePopup = '<div class="modal hide {{modalClass}} {{#isAnimate}}fade{{/isAnimate}}" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="xeroModalLabel" aria-hidden="true" data-backdrop="static">\n\
//                                            <div class="modal-header">\n\
//                                            <button type="button" class="close xeroButtonModal" data-dismiss="modal" aria-hidden="true"> </button>\n\
//                                            <h3 id="xeroModalLabel">{{headerText}}</h3>\n\
//                                            </div>\n\
//                                            <div class="modal-body" id="{{id}}">\n\
//                                            </div>\n\
//                                            <div class="modal-footer">\n\
//                                            {{#buttons}}\n\
//                                            <button class="{{class}} xeroButtonModal" id="{{id}}" {{#IsAutoClose}}data-dismiss="modal" aria-hidden="true"{{/IsAutoClose}}>{{text}}</button>\n\
//                                            {{/buttons}}\n\
//                                            </div>\n\
//                                        </div>';
//        this.template += this.templatePopup;
//        args.template = this.template;


//        Xero.Views.ViewBase.prototype.initialize.call(this, args);
//    },
//    events: {
//        'click button.xeroButtonModal': function (event) {
//            //event.preventDefault();
//            var clickedButton = _.find(this.xeroOptions.buttons, function (button) { return (button.id == event.target.id); });
//            if (clickedButton)
//                this.trigger(clickedButton.event);
//        },
//        'shown': 'showBody'
//    },
//    //        render: function () {
//    //            var that = this;
//    //            var context = that.xeroOptions; // _.extend(that.xeroOptions.toJSON());
//    //            $(that.el).html(Mustache.to_html(that.template, context));
//    //            //$('body').append(Mustache.to_html(that.templatePopup, context));
//    //            return this;
//    //        },
//    showBody: function (event) {
//        //if (_.contains(event.target.classList, 'modal')) { // == 'div#ModalTopic.modal') {
//        var modal = $(this.el).find('.modal');
//        if (this.xeroOptions.fullscreen) {
//            modal.css('width', $(window).width() - this.xeroOptions.fullscreenMargins[0]);
//            modal.css('height', $(window).height() - this.xeroOptions.fullscreenMargins[1]);
//        }
//        modal.css('min-width', this.xeroOptions.minWidth);

//        if (!this.isRendered) {
//            this.isRendered = true;
//            this.renderBody();
//        }

//        $('#topic-picker-body').children().toggleClass('extend-filters');
//        //ToDo: Magic number - the 15 is the height of the gap between the topic filters and the topic tree
//        $('#topics-container').css('top', $('#topics-filters').height() + 15);
//    },
//    renderBody: function () {
//        var bodyElement = this.$el.find('#' + this.xeroOptions.id + ' .modal-body');
//        if (this.xeroOptions.content) {
//            if (this.xeroOptions.content.$el) {
//                bodyElement.html(this.xeroOptions.content.render().el);
//            } else if (typeof this.xeroOptions.content === 'string') {
//                if (this.xeroOptions.content.charAt(0) == '#')
//                    bodyElement.html($(this.xeroOptions.content).html());
//                else
//                    bodyElement.html(this.xeroOptions.content);
//            }
//        } else if (this.xeroOptions.contentTemplateName)
//            bodyElement.html(new Xero.Views.ViewBase({ model: this.model, templateName: this.xeroOptions.contentTemplateName }).render().$el.html());
//    }
//});
