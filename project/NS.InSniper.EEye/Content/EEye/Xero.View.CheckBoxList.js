define(['jquery', 'underscore', 'backbone', 'mustache','Xero.View.Base'], function($, _, Backbone, Mustache) {
    'use strict';

    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : { };
    window.Xero.Models = window.Xero.Models ? window.Xero.Models : { };


    Xero.Views.CheckBoxListItem = Xero.Views.CompositeView.extend({
        tagName: "li",
        className: "x-checkbox-list-item",
        events: {
            'click input[type=button]': function() {

                var checkbox = $(this.el).find('input');
                if (checkbox.hasClass('isChecked')) {
                    checkbox.removeClass('isChecked');
                } else if (checkbox.hasClass('x-partial-selected')) {
                    checkbox.removeClass('x-partial-selected');
                    checkbox.addClass('isChecked');
                } else {
                    checkbox.addClass('isChecked');
                }

                (this.$el).trigger('xEventSelect', this);
            }
        },
        getIsSelect: function() {
            return (this.$el.find('input[type=button]').hasClass('isChecked'));
        },
        setIsSelect: function(bSelect) {
            if (bSelect == 'Partial') {
                this.$el.find('input[type=button]').addClass('x-partial-selected');
                this.$el.find('input[type=button]').removeClass('isChecked');
            } else {
                if (bSelect) {
                    this.$el.find('input[type=button]').addClass('isChecked');
                } else {
                    this.$el.find('input[type=button]').removeClass('isChecked');
                }
                this.$el.find('input[type=button]').removeClass('x-partial-selected');
            }
        },
        initialize: function(options) {
            Xero.Views.CompositeView.prototype.initialize.call(this, options);
        }
    });

    Xero.Views.CheckBoxListItemAll = Xero.Views.CheckBoxListItem.extend({
        tagName: "div",
        className: "x-checkbox-list-item-all"
    });


    Xero.Views.CheckBoxList = Xero.Views.CollectionView.extend({
        tagName: "ul",
        className: "x-checkbox-list",
        itemView: Xero.Views.CheckBoxListItem,
        itemViewOptions: { },
        events: {
            'xEventSelect': function(e, childView) {
                if (childView.getIsSelect()) {
                    if (!this.selectedItems.contains(childView.model))
                        this.selectedItems.add(childView.model);
                } else {
                    this.selectedItems.remove(childView.model);
                }
            }
        },
        initialize: function(options) {
            this.selectedItems = new Xero.Models.ModelCollectionBase();
            this.itemViewOptions = this.itemViewOptions || { };

            if (!this.options.idField)
                this.options.idField = 'Id';

            if (!this.options.titleField)
                this.options.titleField = 'Name';

            if (!options.templateCheckBoxListItem) {
                options.templateCheckBoxListItem = '{{' + this.options.titleField + '}}';
            }

            this.itemViewOptions.template = "xTemplateCheckBoxListItem" + this.cid;
            Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptions.template, "<label class='x-checkbox-list-item'><input type='button' id='{{" + this.options.idField + "}}'><span for='{{" + this.options.idField + "}}'>" + options.templateCheckBoxListItem + "</span></label>");

            Xero.Views.CollectionView.prototype.initialize.call(this, arguments);

            if (options && options.el) {
                this.collection.each(function (item, index) {
                    var ItemView = this.getItemView(item);
                    var view = this.buildItemView(item, ItemView);
                    this.children.add(view);
                },this);
            }
        },
        buildItemView: function (item, ItemView) {

            var itemViewOptions;

            if (_.isFunction(this.itemViewOptions)) {
                itemViewOptions = this.itemViewOptions(item);
            } else {
                itemViewOptions = this.itemViewOptions;
            }

            var options = _.extend({ model: item }, itemViewOptions);

            if (this.options.el)
                options.el = this.$el.find('li input[id=' + item.get(this.options.idField).replace('/', '\\\/') + ']').closest(ItemView.prototype.tagName);

            var view = new ItemView(options);
            return view;
        },
        onRender: function() {
            if (this.options.selectedItems) {
                this.options.selectedItems = _.isArray(this.options.selectedItems) ? this.options.selectedItems : [this.options.selectedItems];
                _.each(this.options.selectedItems, function(item) {
                    this.selectItem(item, true);
                }, this);
            }
        },
        selectAll: function(bSelect) {
            _.each(this.children.toArray(), function(childView) {
                childView.setIsSelect(bSelect);
                if (bSelect) {
                    if (!this.selectedItems.contains(childView.model))
                        this.selectedItems.add(childView.model);
                } else {
                    this.selectedItems.remove(childView.model);
                }
            }, this);
        },
        selectItem: function(item, bSelect) {
            _.each(this.children.toArray(), function(childView) {
                if (childView.model == item || childView.model.cid == item || childView.model.get(this.options.idField) == item) {
                    childView.setIsSelect(bSelect);
                    if (bSelect) {
                        if (!this.selectedItems.contains(childView.model))
                            this.selectedItems.add(childView.model);
                    } else {
                        this.selectedItems.remove(childView.model);
                    }
                }
            }, this);
        },
        getValueTitle: function() {
            if (this.selectedItems.length == 0)
                return ([]);

            var result = [];
            this.selectedItems.each(function(item) {
                result.push(item.get(this.options.titleField));
            }, this);
            return (result);
        },
        getValue: function() {
            if (this.selectedItems.length == 0)
                return ([]);

            var result = [];
            this.selectedItems.each(function(item) {
                result.push(item.get(this.options.idField));
            }, this);
            return (result);
        }
    });

    Xero.Views.CheckBoxListContainer = Xero.Views.View.extend({
        tagName: "div",
        className: 'x-checkbox-list-container',
        options: {
            delay: 500
        },
        constructor: function (options) {
            if (options && options.el && !options.collection) {
                var guiCollection = this._createCollectionFromGui(options.el);
                options.collection = guiCollection.collection;
                if (!options.selectedItems)
                    options.selectedItems = guiCollection.selectedItems;
            }
            

            if(options && options.collection && !(options.collection instanceof Backbone.Collection))
                options.collection = new Xero.Models.ModelCollectionBase( options.collection );

            Xero.Views.View.prototype.constructor.call(this, options);

        },
        initialize: function(options) {
            options = options || {};

            Xero.Views.View.prototype.initialize.call(this, options);

            if (options.collection) {
                if (options && !options.el) {
                    this.CheckBoxList = new Xero.Views.CheckBoxList({ collection: options.collection, selectedItems: options.selectedItems });
                }
                else if (options && options.el) {
                    this.CheckBoxList = new Xero.Views.CheckBoxList({ collection: options.collection, selectedItems: options.selectedItems, el: $(options.el).find('ul') });
                }
            }
        },
        _createCollectionFromGui: function (el) {
            var collection = [];
            var selectedItems = [];
            _.each(el.find('input[type=button]'), function (checkbox) {
                collection.push({ Id: checkbox.id, Name: checkbox.text });
                if ($(checkbox).hasClass('isChecked'))
                    selectedItems.push(checkbox.id)
            }, this);

            return ({ collection : collection , selectedItems:selectedItems });
        },
        events: {
            'xEventSelect': function(e, view) {
                if (view != this.ViewCheckBoxListItemAll) {
                    this.setViewSelectAllStatus();
                } else {
                    if (view.getIsSelect()) {
                        this.CheckBoxList.selectAll(true);
                    } else {
                        this.CheckBoxList.selectAll(false);
                    }
                }
                this._setTimer();
            }
        },
        setViewSelectAllStatus: function() {
            if (this.CheckBoxList.selectedItems.length == this.CheckBoxList.collection.length) {
                if (this.ViewCheckBoxListItemAll)
                    this.ViewCheckBoxListItemAll.setIsSelect(true);
            } else {
                if (this.ViewCheckBoxListItemAll) {
                    if (this.CheckBoxList.selectedItems.length > 0)
                        this.ViewCheckBoxListItemAll.setIsSelect('Partial');
                    else
                        this.ViewCheckBoxListItemAll.setIsSelect(false);
                }
            }
        },
        render: function() {
            Xero.Views.View.prototype.render.call(this, arguments);

            if (this.CheckBoxList) {
                $(this.el).html(this.CheckBoxList.render().el);

                if (this.options.selectAllCheckBoxItem) {
                    if (!this.ViewCheckBoxListItemAll) {
                        var options = _.extend({ model: this.options.selectAllCheckBoxItem }, this.CheckBoxList.itemViewOptions);
                        this.ViewCheckBoxListItemAll = new Xero.Views.CheckBoxListItemAll(options);
                    }

                    //$(this.el).prepend('<div class="divider"></div>');
                    $(this.el).prepend(this.ViewCheckBoxListItemAll.render().el);
                    this.setViewSelectAllStatus();
                }
            }
            return (this);
        },
        getValueTitle: function () {
            if (this.CheckBoxList.selectedItems.length == this.CheckBoxList.collection.length) {
                return ([]);
            } else {
                return (this.CheckBoxList.getValueTitle());
            }
        },
        getValue: function() {
            if (this.CheckBoxList.selectedItems.length == this.CheckBoxList.collection.length) {
                return ([]);
            } else {
                return (this.CheckBoxList.getValue());
            }
        },
        _clearTimer: function() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        },
        _setTimer: function() {
            this._clearTimer();
            this.timer = setTimeout(_.bind(this._raiseReadyEvent, this), this.options.delay);
        },
        _raiseReadyEvent: function() {
            this.trigger('xEventValueReady', this);
        }
    });

});// ($, _, Backbone, Mustache);  