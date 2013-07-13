define(['jquery', 'underscore', 'backbone', 'mustache', 'Xero.View.Base', 'Xero.Model'], function($, _, Backbone, Mustache) {
    'use strict';

    Xero.Views.GridItem = Xero.Views.CompositeView.extend({
        tagName: "tr",
        className: "xeroTableRow",
        initialize: function(options) {
            Xero.Views.CompositeView.prototype.initialize.call(this, options);
        }
    });

    Xero.Views.GridItemHeader = Xero.Views.ItemView.extend({
        tagName: "th",
        constructor: function(args) {
            args.template = "xTemplateGridHeader" + this.cid;
            Backbone.Marionette.TemplateCache.registerTemplate(args.template, '{{HeaderTemplate}}');

            Xero.Views.ItemView.prototype.constructor.call(this, args);
        },
        render: function() {
            //this.template = this.options.template;
            this.$el.html(this.model.get("HeaderTemplateView"));
            var width = this.model.get("Width");
            if (typeof(width) === "string")
                this.$el.width(parseInt(width));

            var classNameHeader = this.model.get('ClassNameHeader');
            if(classNameHeader)
                this.$el.addClass(classNameHeader);
            
            return (this);
        }
    });

    Xero.Views.GridItemBody = Xero.Views.GridItem.extend({
        onRender: function () {
            this.$el.attr('id', this.model.cid);
            if (this.options.classNameProvider)
                this.$el.attr('class', this.options.classNameProvider(this.model));
        },
        //constructor: function (args) {
        //    Marionette.ItemView.prototype.constructor.call(this, args);
        //    this.model.on('change', this.render);
        //},
        //serializeData: function() {
        //    return (Xero.Views.GridItem.prototype.serializeData.call(this));
        //},
        //render: function() {
        //    Xero.Views.GridItem.prototype.render.call(this, arguments);

        //    return (this);
        //}
    });
    Xero.Views.GridItemFooter = Xero.Views.GridItem.extend({
        
    });

    Xero.Views.GridSection = Xero.Views.CollectionView.extend({
        className: 'row',
        initialize: function(options) {
            Backbone.Marionette.CollectionView.prototype.initialize.call(this, arguments);
        }
    });

    Xero.Views.GridHeader = Xero.Views.CompositeView.extend({
        itemView: Xero.Views.GridItemHeader,
        tagName: "thead",
        itemViewContainer: "tr",
        constructor: function(args) {
            args.template = "xTemplateGridHeader" + this.cid;
            Backbone.Marionette.TemplateCache.registerTemplate(args.template, "<tr></tr>");

            Xero.Views.CompositeView.prototype.constructor.call(this, args);
        }

        //initialize: function(options) {
        //    Xero.Views.CompositeView.prototype.initialize.call(this, options);
        //}
    });

    Xero.Views.GridFooter = Xero.Views.View.extend({
        itemView: Xero.Views.GridItemFooter,
        tagName: "tfoot",
        initialize: function(options) {
            Xero.Views.View.prototype.initialize.call(this, options);

            if (this.model && this.model.pagingInfo) {
                this.model.pagingInfo.on('change:perPage', function() {
                    //this.renderFooter();
                    this.renderFooterContentByNavigation();
                }, this);

                this.model.pagingInfo.on('change:totalCount', function() {
                    //this.renderFooter();
                    this.renderFooterContentByNavigation();
                }, this);

                this.model.pagingInfo.on('change:totalPage', function() {
                    //this.renderFooter();
                    this.renderFooterContentByNavigation();
                }, this);

                this.model.pagingInfo.on('change:currentPage', function() {
                    //this.renderFooter();
                    this.renderFooterContentByNavigation();
                }, this);
            }

            //if (this.model && this.model.pagingInfo)
            //this.model.pagingInfo.on('change', this.render);
        },
        renderFooterContentByNavigation: function() {
            if (this.model.pagingInfo) {
                var context = this.model.pagingInfo.toJSON();

                if (context.totalPages <= 0)
                    context.totalPages = 1;
                if (context.currentPage < 0)
                    context.currentPage = 0;
                if (context.currentPage >= context.totalPages)
                    context.currentPage = context.totalPages - 1;

                if (this.options.hideFastPageNavigation)
                    context.HideFastPageNavigation = true;
                if (this.options.pageSizeOptions) {
                    context.ShowPageSizeOptions = true;
                    context.PageSizeOptions = [];
                    _.each(this.options.pageSizeOptions, function(item) {
                        context.PageSizeOptions.push({ value: item, IsSelected: item == context.perPage });
                    }, this);
                }

                context.middlePagesNavigation = _.range(Math.max(0, Math.min(context.currentPage - 3, context.totalPages - 7)) + 1, Math.min(context.totalPages, Math.max(context.currentPage + 3, 6) + 1) + 1);
                context.firstPagesNavigation = [1];
                context.lastPagesNavigation = [context.totalPages];

                context.lastPagesNavigation = _.difference(context.lastPagesNavigation, context.middlePagesNavigation);
                context.firstPagesNavigation = _.difference(context.firstPagesNavigation, context.middlePagesNavigation);
                if (context.firstPagesNavigation[context.firstPagesNavigation.length - 1] == context.middlePagesNavigation[0] - 1) {
                    context.middlePagesNavigation = _.union(context.firstPagesNavigation, context.middlePagesNavigation);
                    context.firstPagesNavigation = [];
                }
                if (context.lastPagesNavigation[0] == context.middlePagesNavigation[context.middlePagesNavigation.length - 1] + 1) {
                    context.middlePagesNavigation = _.union(context.middlePagesNavigation, context.lastPagesNavigation);
                    context.lastPagesNavigation = [];
                }

                context.middlePagesNavigation[_.indexOf(context.middlePagesNavigation, context.currentPage + 1)] = { PageNo: context.currentPage + 1, IsActive: true };

                var templateFooter = '<div id="paging-controls">\n' +
                    '<div id="ComboBoxPageNumber" class="pagination"> <span class="paging-label">Page</span> \n' +
                    '<ul>\n' +
                    '{{#firstPagesNavigation}}<li value="{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}" class="page-selector {{#IsActive}}active{{/IsActive}}"><a href="#">{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}</a></li>{{/firstPagesNavigation}}\n' +
                    '{{#firstPagesNavigation}}<li class="disabled"><a href="#">...</a></li>{{/firstPagesNavigation}}\n' +
                    '{{#middlePagesNavigation}}<li value="{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}" class="page-selector {{#IsActive}}active{{/IsActive}}"><a href="#">{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}</a></li>{{/middlePagesNavigation}}\n' +
                    '{{#lastPagesNavigation}}<li class="disabled"><a href="#">...</a></li>{{/lastPagesNavigation}}\n' +
                    '{{#lastPagesNavigation}}<li value="{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}" class="page-selector {{#IsActive}}active{{/IsActive}}"><a href="#">{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}</a></li>{{/lastPagesNavigation}}\n' +
                    '</ul>';

                templateFooter += '{{^ShowPageSizeOptions}}</div>\n' +
                    '<div id="paging-prev-next"><span id="page-left"></span><span id="page-divider"></span><span id="page-right"></span></div>\n' +
                    '</div>{{/ShowPageSizeOptions}}';

                templateFooter += '{{^HideFastPageNavigation}}<span class="inline" id="go-to-page">Go to page</span>' +
                    '<input type="text" class="inline" id="current-page" maxlength="5" />' +
                    '<button role="button" class="boss-btn white-bg blue inline" id="go-to-page-btn">Go</button></div>{{/HideFastPageNavigation}}';

                templateFooter += '{{#ShowPageSizeOptions}}<div class="right">' +
                    '<span>Showing</span>' +
                    '<select id="page_size_option_' + this.cid + '" class="chzn-select page_size_option">' +
                    '{{#PageSizeOptions}}' +
                    '<option value="{{value}}" {{#IsSelected}}selected="selected"{{/IsSelected}} >{{value}}</option>' +
                    '{{/PageSizeOptions}}' +
                    '</select>' +
                    '<span id="count_total">items per page ({{totalCount}} total items)</span>' +
                    '</div>{{/ShowPageSizeOptions}}';

                templateFooter = '<tr><td colspan="' + this.options.columnsCount + '">\n' + templateFooter + '</td></tr>';

                this.$el.html(Mustache.to_html(templateFooter, context));

                if (this.$el.parent().length > 0)
                    this.$el.find('.chzn-select').chosen({ disable_search: true, width: "150px" });
                
               
            }
        },
        renderFooterContentByComboBox: function() {
            //if (this.xeroOptions.showFooter) {
            if (this.elementGrid) {
                if (this.elementGrid.find('tfoot').length > 0) {
                    if (this.model.pagingInfo) {
                        var context = this.model.pagingInfo.toJSON();
                        var templateFooter = '<tr><td colspan="2"><div>\n\
                                <div id="paging-controls"><span>Page</span><div id="ComboBoxPageNumber"><select  class="chzn-select"></select></div><span>of {{totalPages}}</span></div>\n\
                                <div id="paging-description"><span>{{totalCount}} Search Results</span></div>\n\
                                <div id="paging-prev-next"><span id="page-left"></span><span id="page-divider"></span><span id="page-right"></span></div>\n\
                                </div></td></tr>';
                        this.elementGrid.find('tfoot').html(Mustache.to_html(templateFooter, context));
                        var pageNumbers = _.range(1, context.totalPages + 1); //new Xero.Models.ModelCollectionBase(_.range(1, context.totalPages));
                        var comboBoxPageNumber = new Xero.Views.ComboBox({ model: pageNumbers, xeroOptions: { titleField: '.', isChosenCombobox: true } });

                        this.elementGrid.find('tfoot').find('#ComboBoxPageNumber').html(comboBoxPageNumber.render().el);
                    }
                }
            }
            //}
        },
        onRender: function() {
            this.renderFooterContentByNavigation();
        },
        render: function() {
            Xero.Views.View.prototype.render.call(this, arguments);
            this.renderFooterContentByNavigation();

            return (this);
        }
    });

    Xero.Views.GridBody = Xero.Views.GridSection.extend({
        itemView: Xero.Views.GridItemBody,
        tagName: "tbody",
        initialize: function(options) {
            Xero.Views.GridSection.prototype.initialize.call(this, options);
        }
        //onItemRemoved: function(view) {
        //    if (view.$el.find('input[type=checkbox]:checked').length > 0) {
        //        this.trigger("rowSelected", null);
        //    }
        //},
        //onBeforeRender: function(view) {
        //    if (view.$el.find('input[type=checkbox]:checked').length > 0) {
        //        this.callChanges= true;
        //    }
        //},
        //onRender: function(view) {
        //if (this.callChanges) {
        //    this.callChanges = false;
        //    this.trigger("rowSelected", null);
        //}
        //}
    });

    Xero.Views.Grid2 = Xero.Views.View.extend({
        tagName: "table",
        className: "table table-condensed table-bordered",
        defaultColumn: { IsSortable: false, IsRowSelector: false, IsExpandable: false, SortOrder: '', HeaderTemplate: '', HeaderToolTip: '', IsHidden: false, FieldName: '', ClassName: '', ClassNameHeader: '', Template: '' },
        events: {
            "click thead .grid_column_sortable": "_onSortingColumnClicked",
            "change thead .select-all": "_onSelectAllChanged",
            "change tbody input[type=checkbox].row-checkbox": "_onRowSelectionChanged",
            "change tbody input[type=radio]": "_onRowSelectionChanged",
            'click tbody tr': '_handleClickBodyRow',
            "keyup #current-page": function(event) {
                if (event.keyCode == 13) this._onPageChanged();
            },
            'change .page_size_option': function() {
                var that = this;
                var pageSize = parseInt(this._GridFooter.$el.find('.page_size_option').val());

                Xero.View.UI.Progress(that.$el, true);
                this.collection.requestPageSize(pageSize).always(function() {
                    Xero.View.UI.Progress(that.$el, false);
                    that.trigger('xEventPageSizeChanged', pageSize);
                });
            },
            'click #go-to-page-btn': function() {
                this._onPageChanged();
            },
            'click #page-left': function() {
                var that = this;
                Xero.View.UI.Progress(that.$el, true);
                this.collection.requestPreviousPage().always(function() {
                    Xero.View.UI.Progress(that.$el, false);
                });
            },
            'click #page-right': function() {
                var that = this;
                Xero.View.UI.Progress(that.$el, true);
                this.collection.requestNextPage().always(function() {
                    Xero.View.UI.Progress(that.$el, false);
                });
            },
            'click li.page-selector': function(e) {
                var value = e.currentTarget.value;
                if (value) {
                    var that = this;
                    Xero.View.UI.Progress(that.$el, true);
                    this.collection.goTo(value - 1).always(function() {
                        Xero.View.UI.Progress(that.$el, false);
                    });
                }
            },
            'click .expander': function(event) {
                event.preventDefault();
                var row = $(event.currentTarget).parents("tr");
                var id = row.attr('id');
                var model = this.collection.get(id);
                if ($(event.currentTarget).children().hasClass("icon-expanded")) {
                    var next = $(row).next(0);
                    if (typeof(next) === "undefined")
                        return;
                    if (typeof(next.hide) === "function")
                        next.hide();

                    row.find(".icon-expanded").removeClass("icon-expanded").addClass("icon-shrinked");

                    this.trigger("rowShrink", row);
                } else if ($(event.currentTarget).children().hasClass("icon-shrinked")) {
                    var next = $(row).next(0);
                    if (next.attr("data-parent") === id) {
                        next.show();
                    } else {
                        var tr = $('<tr>').attr('data-parent', id);
                        var td = $('<td  class="ticket-summary-container">').attr('colspan', this.options.columns.length);

                        if (this.options.expanderView) {
                            if (typeof this.options.expanderView === 'function') {
                                var view = this.options.expanderView(model);
                                if (view)
                                    $(row).after(tr.html(td.html(view.render().$el)));
                            } else {
                                var view = new this.options.expanderView(model);
                                if (view)
                                    $(row).after(tr.html(td.html(view.render().$el)));
                            }
                        }
                    }

                    row.find(".icon-shrinked").removeClass("icon-shrinked").addClass("icon-expanded");

                    this.trigger("rowExpand", row);
                }
            }
        },
        initialize: function(options) {
            Xero.Views.View.prototype.initialize.call(this, options);

            this._initSelection();

            this.columns = this.columns || [];

            this.itemViewOptions = this.itemViewOptions || options.itemViewOptions || {};
            this.itemViewOptionsHeader = this.itemViewOptionsHeader || {};
            this.itemViewOptionsHeaderColumn = this.itemViewOptionsHeaderColumn || {};
            this.itemViewOptionsFooter = this.itemViewOptionsFooter || {};

            this._initColumns(options.columns);

            if (!this.itemViewOptions.template) {
                var stTemplateRow = this._initItemViewBody(options.columns);
                this.itemViewOptions.template = "xTemplateGridItem" + this.cid;
                Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptions.template, stTemplateRow);
                this.itemViewOptions.templateHelpers = function(model) {
                    var helper = { IsExpandable: true };
                    if (options.isExpandable) {
                        if (typeof options.isExpandable === 'function')
                            helper.IsExpandable = options.isExpandable(this.model);
                        else
                            helper.IsExpandable = options.isExpandable;
                    }
                    return (helper);
                };
            }
            this._GridBody = new Xero.Views.GridBody({ itemViewOptions: this.itemViewOptions, collection: this.collection });
            this._GridBody.on('item:removed', function(view) {
                this._onItemRemoved(view);
            }, this);

            if (options.showHeader) {
                if (!this.itemViewOptionsHeader.template) {
                    this._initItemViewHeader(options.columns);
                    //var stTemplateHeaderColumn = { Template: '{{HeaderTemplate}}' };
                    //this.itemViewOptionsHeaderColumn.template = "xTemplateGridItemHeader" + this.cid;
                    //Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptionsHeaderColumn.template, stTemplateHeaderColumn);
                }
                this._GridHeader = new Xero.Views.GridHeader({ /*itemViewOptions: this.itemViewOptionsHeaderColumn,*/  collection: new Xero.Models.ModelCollectionBase(options.columns) });
            }

            if (options.showFooter) {
                if (!this.itemViewOptionsFooter.template) {
                    var stTemplateFooter = this._initItemViewFooter(options.columns);
                    this.itemViewOptionsFooter.template = "xTemplateGridItemFooter" + this.cid;
                    Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptionsFooter.template, stTemplateFooter);
                }
                this._GridFooter = new Xero.Views.GridFooter({ itemViewOptions: this.itemViewOptionsFooter, model: this.collection, columnsCount: this.options.columns.length, pageSizeOptions: this.options.pageSizeOptions, hideFastPageNavigation: this.options.hideFastPageNavigation });
            }

            if (options.initiateCollection && options.collection) {
                this.filter();
            }
        },
        _initSelection: function() {
            this._selectedModelCollection = new Xero.Models.ModelCollectionBase();
            //this._selectedModelCollection.bind("reset", this._onSelectionReset, this);
            //this._selectedModelCollection.bind("add", this._onSelectionAdd, this);
            //this._selectedModelCollection.bind("remove", this._onSelectionRemove, this);
        },
        _onItemRemoved: function(view) {
            if (view) {
                if (view.model && this._selectedModelCollection.contains(view.model)) {
                    this._selectedModelCollection.remove(view.model);
                    this.trigger("rowSelected");
                }

                if (view.$el.find('input[type=checkbox]:checked.row-checkbox').length > 0) {
                    this._updateStatusAllChekBox();
                }

                var id = view.$el.attr('id');
                var next = this.$el.find("tr").filter(function() {
                    return $(this).data('parent') == id;
                });

                //var next = this.$el.find("tr:data(parent=='" + id + "')");
                if (next.length > 0) {
                    next.remove();
                }
            }
        },
        getSelectedModel: function() {
            return (this._selectedModelCollection.at(0));
        },
        getSelectedModelCollection: function() {
            return (this._selectedModelCollection);
        },
        _initColumns: function(columns) {
            _.each(columns, function(column, index) {
                if (typeof(column) === 'string') {
                    column = { FieldName: column };
                }

                if (column.IsRowSelector) {
                    column.Template = column.Template || '';
                    if (column.SingleSelection) {
                        column.Template += '<input id="{{Id}}" class="row-checkbox " type="radio" name="' + this.cid + '" value="{{Id}}"><label for="{{Id}}"></label>';
                        column.HeaderTemplate = '';
                    } else {
                        column.Template += '<input id="{{Id}}" class="row-checkbox " type="checkbox" value="{{Id}}"><label for="{{Id}}"></label>';
                        column.HeaderTemplate = '<input id="' + this.cid + 'select-all" class="select-all " type="checkbox" title="Select all"><label for="' + this.cid + 'select-all" class="select-all"></label>';
                    }
                    column.IsSortable = false;
                    if (!column.ClassName)
                        column.ClassName = "xeroTableColumnSelector";
                }
                if (column.IsExpandable) {
                    column.Template = column.Template || '';
                    column.Template += '{{#IsExpandable}}<div class="expander"><span class="icon-shrinked"></span></div>{{/IsExpandable}}';
                    column.IsSortable = false;
                }

                if (!column.Template) {
                    column.Template = '<span class="xeroField">{{' + column.FieldName + '}}</span>';
                }

                if (!column.HeaderTemplate) {
                    column.HeaderTemplate = column.FieldName;
                }

                if (!column.SortOrder) {
                    column.SortOrder = '';
                }

                if (column.IsSortable) {
                    column = this._InitColumnHeaderSortTemplate(column, index);
                } else {
                    column.HeaderTemplateView = column.HeaderTemplate;
                }

                if (!column.ClassNameHeader) {
                    column.ClassNameHeader = column.ClassName;
                }

                columns[index] = _.defaults(column, this.defaultColumn);
            }, this);
        },
        _InitColumnHeaderSortTemplate: function(column, index) {
            if (!column.HeaderToolTip)
                column.HeaderToolTip = "";

            if (column.IsSortColumn) {
                if (column.SortOrder == 'DESC') {
                    column.HeaderTemplateView = '<a id="' + index + '" class="grid_column_sortable" data-sort-column="TRUE" data-sort-order="DESC" title="' + column.HeaderToolTip + '" href="#"><span>' + column.HeaderTemplate + '</span><span class="icon-desc"></span></a>';
                } else if (column.SortOrder == 'ACS') {
                    column.HeaderTemplateView = '<a id="' + index + '" class="grid_column_sortable" data-sort-column="TRUE" data-sort-order="ASC" title="' + column.HeaderToolTip + '" href="#"><span>' + column.HeaderTemplate + '</span><span class="icon-asc"></span></a>';
                }
            } else {
                column.HeaderTemplateView = '<a id="' + index + '" class="grid_column_sortable" title="' + column.HeaderToolTip + '" href="#"><span>' + column.HeaderTemplate + '</span></a>';
            }
            return (column);
        },
        _initItemViewHeader: function(columns) {
            var stTemplateHeader = "";

            _.each(columns, function(column) {
                stTemplateHeader += '<th class="' + column.ClassNameHeader + '"';
                if (typeof(column.Width) === "string")
                    stTemplateHeader += ' style="width:' + column.Width + '"';
                stTemplateHeader += '> ' + column.HeaderTemplate + '</th>';
            }, this);

            return (stTemplateHeader);
        },
        _initItemViewFooter: function(options) {
            return ("");
        },
        _initItemViewBody: function(columns) {
            var stTemplateRow = "";

            _.each(columns, function(column) {
                stTemplateRow += '<td class="' + column.ClassName + '" ';
                if (column.Width)
                    stTemplateRow += 'style="width:' + column.Width + '"';
                stTemplateRow += '>' + column.Template + '</td>';
            }, this);

            return (stTemplateRow);
        },
        _onSortingColumnClicked: function(event) {
            event.preventDefault();
            var toggleSortOrder = this._toggleSortOrder;
            _.each(this.options.columns, function(col, index) {
                if (col.IsSortable) {
                    if (index == event.currentTarget.id) {
                        col.SortOrder = toggleSortOrder(col.SortOrder);
                        col.IsSortColumn = true;
                        col = this._InitColumnHeaderSortTemplate(col, index);
                        this._GridHeader.collection.at(index).set('HeaderTemplateView', col.HeaderTemplateView);
                    } else {
                        col.SortOrder = "";
                        col.IsSortColumn = false;
                        col = this._InitColumnHeaderSortTemplate(col, index);
                        this._GridHeader.collection.at(index).set('HeaderTemplateView', col.HeaderTemplateView);
                    }
                }
            }, this);
            this._updateModelSortingParameters();
        },
        _onSelectAllChanged: function(event) {
            if (this.$el.find('#' + event.currentTarget.id).prop("checked")) {
                this.$el.find("tbody input[type=checkbox].row-checkbox").prop("checked", true);
            } else {
                this.$el.find("tbody input[type=checkbox].row-checkbox").prop("checked", false);
            }
            if (event && event.currentTarget) {
                if (this.$el.find('#' + event.currentTarget.id).prop('checked')) {
                    this.collection.each(function(item) {
                        this._selectedModelCollection.add(item);
                    }, this);
                } else {
                    this._selectedModelCollection.removeAll();
                }
            }
            this.trigger("allSelected", event);
        },
        _updateStatusAllChekBox: function() {
            var selectAllCheckBox = this.$el.find("#" + this.cid + "select-all");

            if (selectAllCheckBox.length > 0) {
                var checkedCount = this.$el.find("tbody input[type=checkbox]:checked.row-checkbox").length;
                var totalCount = this.$el.find("tbody input[type=checkbox].row-checkbox").length;
                if (checkedCount === 0) {
                    selectAllCheckBox.prop("checked", false);
                    selectAllCheckBox.prop("indeterminate", false);
                } else if (checkedCount === totalCount) {
                    selectAllCheckBox.prop("checked", true);
                    selectAllCheckBox.prop("indeterminate", false);
                } else {
                    selectAllCheckBox.prop("indeterminate", true);
                    selectAllCheckBox.prop("checked", false);
                }
            }
        },
        _onRowSelectionChanged: function(event) {
            this._updateStatusAllChekBox();

            if (event && event.currentTarget) {
                var selectAllCheckBox = this.$el.find("#" + this.cid + "select-all");
                if (this.$el.find(event.currentTarget).prop('checked')) {
                    if (selectAllCheckBox.length <= 0) {
                        this._selectedModelCollection.removeAll();
                    }
                    this._selectedModelCollection.add(this.collection.get(event.currentTarget.id));
                } else {
                    this._selectedModelCollection.remove(this.collection.get(event.currentTarget.id));
                }
                this.trigger("rowSelected", event);
            }
        },
        _handleClickBodyRow: function(event) {
            if (!this.options.columns[0].IsRowSelector) {
                $(event.currentTarget).addClass('xGridRowSelectedStyle').siblings().removeClass('xGridRowSelectedStyle');
                this._selectedModelCollection.removeAll();
                this._selectedModelCollection.add(this.collection.get(event.currentTarget.id));
                this.trigger("rowSelected", event);
            }
        },
        _updateModelSortingParameters: function() {
            var pagedCollection = this.collection;
            //if (typeof (pagedCollection) === "undefined")
            //    return;

            var order = {};
            _.each(this.options.columns, function(col, index) {
                if (col.IsSortColumn) {
                    order.SortBy = col.FieldName;
                    order.SortOrder = col.SortOrder;
                }
            });
            // Reset current page number to 1
            //this.collection.currentPage = 1;
            // Refresh paged collection
            //pagedCollection.pager();
            var that = this;
            Xero.View.UI.Progress(that.$el, true);
            pagedCollection.requestSort(order).always(function() {
                Xero.View.UI.Progress(that.$el, false);
            });

            if (this._GridHeader) {
                this._GridHeader.render();
            }
        },
        _toggleSortOrder: function(order) {
            if (typeof(order) != "string")
                return "DESC";
            if (order === "DESC")
                return "ACS";
            return "DESC";
        },
        _onRowExpandToggle: function(row) {
            $(row).find(".icon-shrinked").removeClass("icon-shrinked").addClass("icon-expanded");
            var id = $(row).attr("data-key");
            if (typeof(id) === "undefined")
                return;
            // If this summary is already loaded
        },
        _onPageChanged: function() {
            var that = this;
            if (this._GridFooter.$el.find('#current-page').val()) {
                var pageNo = parseInt(this._GridFooter.$el.find('#current-page').val());
                pageNo--;

                Xero.View.UI.Progress(that.$el, true);
                this.collection.goTo(pageNo).always(function() {
                    Xero.View.UI.Progress(that.$el, false);
                });
            }
        },
        render: function() {
            Xero.Views.View.prototype.render.call(this, arguments);

            if (this._GridBody) {
                //this.$el.append('<div class="body-container"/>');
                //this.$el.find('.body-container').html(this._GridBody.render().el);
                this.$el.append(this._GridBody.render().el);
                //this.$el.append('<div class="body-container"/>');
                //this.$el.find('.body-container').html(this._GridBody.render().el);
            }

            if (this._GridHeader) {
                this.$el.append(this._GridHeader.render().el);
            }

            if (this._GridFooter) {
                this.$el.append(this._GridFooter.render().el);
            }

            return (this);
        },
        filter: function(filters) {
            var that = this;
            Xero.View.UI.Progress(that.$el, true);
            var result=that.collection.filter(filters).done(function(response) {
                if (response.errors || response.error)
                    that.$el.trigger('xEventError', { errors: response.errors, error: response.error });
            }).fail(function(errorContext, errorType, errorMessage) {
                 that.$el.trigger('xEventError', { errorContext: errorContext, errorType: errorType, errorMessage: "Error occurred while loading the grid" });
            }).always(function() {
                Xero.View.UI.Progress(that.$el, false);
            });

            return (result);
        },
        refresh:function() {
            var that = this;
            Xero.View.UI.Progress(that.$el, true);
            that.collection.pager({ useLastQueryOptions : true }).done(function (response) {
                if (response.errors || response.error)
                    that.$el.trigger('xEventError', { errors: response.errors, error: response.error });
            }).fail(function (errorContext, errorType, errorMessage) {
                that.$el.trigger('xEventError', { errorContext: errorContext, errorType: errorType, errorMessage: "Error occurred while loading the grid" });
            }).always(function () {
                Xero.View.UI.Progress(that.$el, false);
            });
        }
    });

    Xero.Views.GridContainer = Xero.Views.View.extend({
        tagName: "div",
        className: 'gridview',
        initialize: function(options) {
            Xero.Views.View.prototype.initialize.call(this, options);
            options = options || {};

            if (options && options.collection) {
                var that = this;
                if (options.el)
                    options.el = null;
                this._Grid = new Xero.Views.Grid2(options);

                // Forward all child item view events through the parent,
                // prepending "itemview:" to the event name
                this._Grid.bind("all", function() {
                    var args = Array.prototype.slice.call(arguments);
                    //args[0] = "itemview:" + args[0];
                    args.splice(1, 0, that._Grid);

                    that.triggerMethod.apply(that, args);
                });

                options.noRowMessage = options.noRowMessage || 'There are no items to display';
                options.classEmptyTable = options.classEmptyTable || 'emptyTable';
                if (!this.viewOptionsEmpty) {
                    this.viewOptionsEmpty = this.viewOptionsEmpty || {};
                    var stTemplateRow = this._initViewEmpty(options);
                    this.viewOptionsEmpty.template = "xTemplateGridEmpty" + this.cid;
                    Backbone.Marionette.TemplateCache.registerTemplate(this.viewOptionsEmpty.template, stTemplateRow);
                }

                var that = this;
                options.collection.on('reset', function() {
                    //if ((that.$el.find('tbody').length == 0 && that.collection.models.length > 0) ||
                    //    (that.$el.find('tbody').length > 0 && that.collection.models.length == 0)) {
                    that.render();
                    //}
                });
                options.collection.on('add', function() {
                    //if (that.$el.find('tbody').length == 0) {
                    that.render();
                    //}
                });
                options.collection.on('remove', function() {
                    //if (that.collection.models.length <= 0 && that.$el.find('tbody').length > 0) {
                    that.render();
                    //}
                });
            }

            //if (options.el)
            //this.render();
        },
        getSelectedModel: function() {
            if (this._Grid) {
                return (this._Grid.getSelectedModel());
            }
            return (null);
        },
        getSelectedModelCollection: function() {
            if (this._Grid) {
                return (this._Grid.getSelectedModelCollection());
            }
            return (null);
        },
        getSelectedIds: function() {
            var selectedIds = $.map(this.$el.find("tbody input[type=checkbox]:checked.row-checkbox"), function(e) { return $(e).val(); });
            return (selectedIds);
        },
        _initViewEmpty: function(columns) {
            var stTemplateHeader = Mustache.to_html('<div id="spanEmptyMessage" class="{{classEmptyTable}}">{{noRowMessage}}</div>', { noRowMessage: this.options.noRowMessage, classEmptyTable: this.options.classEmptyTable });

            return (stTemplateHeader);
        },
        renderEmpty: function() {
            if (this.collection && this.collection.models.length > 0) {
                this._Grid.$el.removeClass('hide-block');
                this.$el.find('#spanEmptyMessage').remove();
            } else {
                //if (!this._Grid.hasClass('hide-block'))
                this._Grid.$el.addClass('hide-block');
                if (this.$el.find('#spanEmptyMessage').length == 0) {
                    var html = Marionette.Renderer.render(this.viewOptionsEmpty.template, this.options);
                    this.$el.append(html);
                }
            }
        },
        render: function() {
            Xero.Views.View.prototype.render.call(this, arguments);

            if (this._Grid) {
                if (this._Grid.$el.parent().length == 0) { //Check if the Body was generated before, then do not regenerate it again
                    this._Grid.render();
                    this.$el.html(this._Grid.$el);
                }
            }
            this.renderEmpty();

            if (this.$el.parent().length > 0)
                this.$el.find('.chzn-select').chosen({ disable_search: true });

            //} else {
            //    this.renderEmpty();
            //}

            return (this);
        },
        filter: function(filters) {
            if (this._Grid) {
                return (this._Grid.filter(filters));
            }
            return (null);
        },
        refresh: function() {
            if (this._Grid) {
                return (this._Grid.refresh());
            }
            return (null);
        }

    });

    return (Xero.Views.GridContainer);
});