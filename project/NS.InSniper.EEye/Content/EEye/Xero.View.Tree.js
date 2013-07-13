define(['jquery', 'underscore', 'backbone', 'mustache', 'backbone.marionette','Xero.View.Base'], function ($, _, Backbone, Mustache) {
    'use strict';

    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : { };

    Xero.Views.TreeViewItem = Xero.Views.CompositeView.extend({
        tagName: "li",
        events: {
            'change input[type=checkbox]': function() {
                if (!this.isFirstTimeLoading && this.model.hasChildren()) {
                    this.isFirstTimeLoading = true;
                    var that = this;

                    (that.$el).trigger('xEventNeedData', that);
                    if (this.collection) {
                        that._initialEvents();

                        that.$el.addClass('x-class-loading');
                        (that.$el).trigger('xEventLoading', that);
                        that.collection.filter().done(function() {
                            that.$el.removeClass('x-class-loading');
                            (that.$el).trigger('xEventLoadingComplete', that);
                        }).fail(function() {
                            that.$el.removeClass('x-class-loading');
                            (that.$el).trigger('xEventLoadingError', that);
                        });
                    }
                }
            },
            'click': function(e) {
                //if (!this.model.hasChildren()) {
                    if (!$(e.target).hasClass('x-row-select')) { //if not selected before
                        (this.$el).trigger('xEventSelect', this);
                        e.stopPropagation();
                    }
                //}
            },

            'dblclick': function(e) {
                if (!this.model.hasChildren()) {
                    (this.$el).trigger('xEventDblClick', this);
                }

            }
        },
        initialize: function(options) {
            Xero.Views.CompositeView.prototype.initialize.call(this, arguments);
            if (this.model.hasChildren())
                this.template = options.TemplateTreeViewGroupNode;
            else {
                this.template = options.TemplateTreeViewNode;
            }
            this.itemViewOptions = { TemplateTreeViewGroupNode: options.TemplateTreeViewGroupNode, TemplateTreeViewNode: options.TemplateTreeViewNode };
        },
        appendHtml: function(cv, iv) {
            cv.$("ul:first").append(iv.el);
        },
        onRender: function() {
            Xero.Views.CompositeView.prototype.onRender.call(this, arguments);
            if (this.model.hasChildren()) {
                this.$el.addClass('xClass-Tree-GroupNode');
            } else {
                this.$el.addClass('xClass-Tree-Node');
            }
        } 
    });

    Xero.Views.TreeView = Xero.Views.CollectionView.extend({
        tagName: "ul",
        itemView: Xero.Views.TreeViewItem,
        events: {
            'xEventSelect': function (e) {
                if (!$(e.target).hasClass('x-row-select')) { //if not selected before
                    (this.$el).find('.x-row-select').removeClass('x-row-select');
                    $(e.target).addClass('x-row-select');
                }
            },
            'xEventLoading': function(e, view) {
                this.$el.addClass('x-class-loading');
            },
            'xEventLoadingComplete': function(e) {
                this.$el.removeClass('x-class-loading');
            },
            'xEventLoadingError': function() {
                this.$el.removeClass('x-class-loading');
            },
            'click': function(e) {
            }
        },
        initialize: function(options) {
            this.itemViewOptions = this.itemViewOptions || { };

            if (!options.templateTreeViewGroupNode) {
                options.templateTreeViewGroupNode = '{{TopicTitle}}';
            }

            this.itemViewOptions.TemplateTreeViewGroupNode = "xTemplateTreeViewGroupNode" + this.cid;
            Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptions.TemplateTreeViewGroupNode, "<input type='checkbox' id='" + this.cid + "_{{Id}}'><div class='topic-tree-row'><label class='group-name' for='" + this.cid + "_{{Id}}'>" + options.templateTreeViewGroupNode + "</label></div><ul></ul>");

            if (!options.templateTreeViewNode) {
                options.templateTreeViewNode = '{{TopicTitle}}';
            }

            this.itemViewOptions.TemplateTreeViewNode = "xTemplateTreeViewNode" + this.cid;
            Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptions.TemplateTreeViewNode, "<div class='topic-tree-row'><span id='" + this.cid + "_{{Id}}'>" + options.templateTreeViewNode + "</span></div>");

            Xero.Views.CollectionView.prototype.initialize.call(this, arguments);
        },
        onRender: function() {
            Xero.Views.CollectionView.prototype.onRender.call(this, arguments);
        }
    });


    Xero.Views.TreeViewContainer = Xero.Views.View.extend({
        tagName: "div",
        className: 'css-treeview',
        itemView: Xero.Views.TreeView,
        initialize: function(options) {
            Xero.Views.View.prototype.initialize.call(this, options);

            if (options && options.collection)
                this.TreeView = new Xero.Views.TreeView({ collection: options.collection, templateTreeViewNode: options.templateTreeViewNode, templateTreeViewGroupNode: options.templateTreeViewGroupNode });
        },
        render: function() {
            Xero.Views.View.prototype.render.call(this, arguments);
            if (this.TreeView) {
                $(this.el).html(this.TreeView.render().el);
            }
            return (this);
        }
    });
});
