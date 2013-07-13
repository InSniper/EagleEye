define(['jquery', 'underscore', 'backbone', 'mustache','Xero.View.Base'], function($, _, Backbone, Mustache) {
    'use strict';

    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : { };
    window.Xero.Models = window.Xero.Models ? window.Xero.Models : { };

    Xero.Views.ComboBox = Xero.Views.ViewCollectionBase.extend({
        tagName: 'select',
        xeroOptions: {
            valueField: 'Id',
            titleField: 'Name',
            OptionTemplate: '',
            OptionTemplateName: '',
            OptionView: Xero.Views.ComboBoxOption,
            insertDefaultOption: false,
            defaultOptionTitle: '&nbsp',
            defaultOptionValue: null,
            isChosenCombobox: false,
            isUserComboBox: false,                                                                    
            onChangeTrigger: ''
        },

        initialize: function(args) {
            var that = this;
            args = args || { };
            args.xeroOptions = args.xeroOptions || { };

            if (args && args.xeroOptions) {
                args.xeroOptions = _.extend({ }, this.xeroOptions, args.xeroOptions);
                if (args.xeroOptions.insertDefaultOption && !args.xeroOptions.defaultOption) {
                    args.xeroOptions.defaultOption = { };
                    args.xeroOptions.defaultOption[args.xeroOptions.titleField] = args.xeroOptions.defaultOptionTitle;
                    args.xeroOptions.defaultOption[args.xeroOptions.valueField] = args.xeroOptions.defaultOptionValue;
                }
            }

            Xero.Views.ViewCollectionBase.prototype.initialize.call(this, args);

            $(this.el).on('change', function(e) {
                (that).trigger('xEventSelect', this);
                Backbone.Events.trigger(that.xeroOptions.onChangeTrigger, e.target);
            });

            var self = this;
            this.model.bind("reset", this.renderRows, this);
            this.model.bind("add", function (model) {
                self.renderRow(model);
                self.renderEmptyOption();
                self.runChosen();
            });

            this.model.bind("remove", function (model) {
                self.removeRow(model);
                self.renderEmptyOption();
                self.runChosen();
            });
        },
        runChosen: function () {
            if (this.$el.parent().length > 0) {
                this.$el.removeClass('chzn-done');
                this.$el.parent().find('#' + this.xeroOptions.id + '_chzn').remove();
                (this.$el).chosen({ disable_search: true });
            }
        },
        render: function () {
            Xero.Views.ViewCollectionBase.prototype.render.call(this);

            $(this.el).attr('id', this.xeroOptions.id);
            $(this.el).attr('class', this.xeroOptions.isChosenCombobox ? 'chzn-select' : '');

            this.renderRows();

            this.setSelected(this.xeroOptions.defaultValue);

            return this;


        },
        renderEmptyOption: function () {

            if (this.xeroOptions.insertDefaultOption) {
                var el = $(this.el);
                if (!(this.xeroOptions.defaultOption instanceof Backbone.Model)) {
                    this.xeroOptions.defaultOption = new Xero.Models.ModelBase(_.extend({ length: this.model.models.length }, this.xeroOptions.defaultOption));


                    var model = this.xeroOptions.defaultOption;
                    $(this.el).append(new Xero.Views.ComboBoxOption({
                        model: model,
                        xeroOptions: { isEmptyOption: true, displayField: this.xeroOptions.titleField },
                        template: this.xeroOptions.defaultOptionTemplate
                    }).render().el);
                } else {
                    this.xeroOptions.defaultOption.set('length', this.model.models.length);
                }
            }

        },
        renderRows: function () {
            this.renderEmptyOption();
            _.each(this.model.models || this.model, function (model) {
                this.renderRow(model);
            }, this);
        },           
        renderRow: function(model, prepend) {
            if (this.xeroOptions.isUserComboBox) {
                $(this.el).append(new Xero.Views.ComboBoxOption({
                    model: model,
                    xeroOptions: { isUserOption: true, displayField: this.xeroOptions.titleField }
                }).render().el);

            } else {
                $(this.el).append(new Xero.Views.ComboBoxOption({
                    model: model,
                    xeroOptions: { displayField: this.xeroOptions.titleField }
                }).render().el);
            }
        },
        removeRow: function (model) {
            var el = $(this.el);
            if (model) {
                el.find('option[value=' + model.get('Id') + ']').remove();
            }
        },
        setSelected: function (selectedVal) {
            if (typeof selectedVal === 'undefined')
                $(this.el).find("option[value='']").attr('selected', 'selected');
            else
                $(this.el).find("option[value='" + selectedVal + "']").attr('selected', 'selected');
        },
        getValue: function () {
            return (this.$el.val());
        },
        getValueModel: function () {
            var currentValue = this.getValue();
            return (this.model.find(function (item) {
                return (item.get('Id') == currentValue);
            }
            ));
        }
    });

    Xero.Views.ComboBoxOption = Xero.Views.ViewBase.extend({
        tagName: "option",
        xeroOptions: {
            isUserOption: false,
            displayField: 'Name',
            selected: false,
            optionClass: 'combobox-option',
            isEmptyOption: false
        },

        initialize: function(args) {
            args = args || { };
            args.xeroOptions = args.xeroOptions || { };
            if (!args.template && !args.templateName) {
                args.template = '{{' + args.xeroOptions.displayField + '}}';
            }

            Xero.Views.ViewBase.prototype.initialize.call(this, args);
        },
        render: function () {
            Xero.Views.ViewBase.prototype.render.call(this, arguments);

            if (this.xeroOptions.isEmptyOption && this.model.get(this.xeroOptions.displayField) == '&nbsp') {
                $(this.el).html(this.model.get(this.xeroOptions.displayField)); //'&nbsp');
                $(this.el).attr('value', this.model.get('Id'));
                $(this.el).attr('class', this.xeroOptions.optionClass);
            } else {
                var context;

                if (this.model instanceof Backbone.Model)
                    context = this.model.toJSON();
                else
                    context = this.model;


                $(this.el).attr('value', context.Id);
                $(this.el).attr('class', this.xeroOptions.optionClass);
            }
            return this;
        }
    });

});// ($, _, Backbone, Mustache);  
