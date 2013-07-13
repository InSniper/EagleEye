define(['jquery', 'underscore', 'backbone', 'mustache','Xero.View.UI', 'bootstrap'], function ($, _, Backbone, Mustache) {
    'use strict';


    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        var that = this;
        $(document).on('focusin.modal', function (e) {
            if (that.$element[0] !== e.target && !that.$element.has(e.target).length && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')){
            //if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                that.$element.focus();
            }
        });
    };



    window.Xero = window.Xero ? window.Xero : {};
    window.Xero.Views = window.Xero.Views ? window.Xero.Views : {};
    window.Xero.Models = window.Xero.Models ? window.Xero.Models : {};

    Xero.Views.ViewBase = Backbone.View.extend({
        xeroOptions: {
            appendAt: null
        },
        renderOptions: {//any fields in this object will be passed to render engine as field
        },
        initialize: function (args) {
            Backbone.View.prototype.initialize.call(this, args);

            if (args && args.xeroOptions) {
                var xeroOptionsNew = _.extend({}, this.xeroOptions, args.xeroOptions);
                this.xeroOptions = xeroOptionsNew;
            }

            if (args && args.templateName) {
                this.template = $(args.templateName).html();
                this.compiledTemplate = Mustache.compile(this.template);
            } else if (this.templateName) {
                this.template = $(this.templateName).html();
                this.compiledTemplate = Mustache.compile(this.template);
            } else if (args && args.template) {
                this.template = args.template;
                this.compiledTemplate = Mustache.compile(this.template);
            }

            if (this.model && (this.model instanceof Backbone.Model) && !this.xeroOptions.doNotUseAutoRendering) {
                this.model.bind("change", this.render, this);
                //this.setModel(this.model, true, true);
            }

            if (args && args.renderOptions)
                this.renderOptions = _.extend({}, args.renderOptions);

            //if(this.xeroOptions.appendAt)
            //$(this.xeroOptions.appendAt).html(this.render().el);
        },
        render: function () {
            var that = this;
            if (that.template) {
                var context = {};
                if (that.model) {
                    if (this.model instanceof Backbone.Model)
                        context = _.extend(that.model.toJSON(), { cid: that.model.cid }, that.xeroOptions, that.renderOptions);
                    else
                        context = _.extend({}, that.model, that.xeroOptions, that.renderOptions);
                } else {
                    context = that.xeroOptions;
                }

                if (that.compiledTemplate) {
                    $(that.el).html(that.compiledTemplate(context));
                } else {
                    $(that.el).html(Mustache.to_html(that.template, context));
                }

                if (that.model)
                    $(that.el).attr('id', that.model.cid);

            }
            return this;
        },
        setModel: function (model, notRender, isInitial) {
            if (model != this.model || isInitial) {
                if (!isInitial) {
                    if (this.model && (this.model instanceof Backbone.Model)) {
                        this.model.unbind("change", this.render, this);
                    }
                    this.model = model;
                }
                if (this.model && (this.model instanceof Backbone.Model)) {
                    this.model.bind("change", this.render, this);
                }
                if (!notRender)
                    this.render();
            }
        }
    });

    Xero.Views.ViewCollectionBase = Xero.Views.ViewBase.extend({
        _selectedModelCollection: null,
        _rowViewCollection: null,
        initialize: function (args) {
            var that = this;

            Xero.Views.ViewBase.prototype.initialize.call(this, args);

            this._rowViewCollection = new Xero.Models.ModelCollectionBase();

            this._selectedModelCollection = new Xero.Models.ModelCollectionBase();
            this._selectedModelCollection.bind("reset", this._onSelectionReset, this);
            this._selectedModelCollection.bind("add", this._onSelectionAdd, this);
            this._selectedModelCollection.bind("remove", this._onSelectionRemove, this);

            if (this.model instanceof Backbone.Model) {
                this.model.bind("reset", this.renderRows, this);
                this.model.bind("add", function (model) {
                    that.renderRow(model);
                });
                this.model.bind("remove", function (model) {
                    that.removeRow(model);
                });
            }
        },
        _findRowView: function (model) {
            var rowView = null;
            if (model instanceof Backbone.Model) {
                rowView = _.find(this._rowViewCollection, function (item, a, b, c, d) {
                    if (model.cid == item.model.cid)
                        return (true);
                    return (false);
                });
            } else {
                rowView = this._rowViewCollection.find(function (item, a, b, c, d) {
                    if (model == item.get(item.idAttribute))
                        return (true);
                    return (false);
                });
            }

            return (rowView);
        },
        _onSelectionReset: function () {
        },
        _onSelectionAdd: function (model) {
            var selectedRow = this._findRowView(model);

            if (selectedRow) {
                if (selectedRow.select)
                    selectedRow.select(true);
            }
        },
        _onSelectionRemove: function (model) {
            var selectedRow = this._findRowView(model);

            if (selectedRow) {
                if (selectedRow.select)
                    selectedRow.select(false);
            }
        },
        resetSelection: function () {
            this._selectedModelCollection.reset();
        },
        addSelection: function (model) {
            var selectedRow = this._findRowView(model);
            if (selectedRow)
                this._selectedModelCollection.add(selectedRow.model);
        },
        removeSelection: function (model) {
            var selectedRow = this._findRowView(model);
            if (selectedRow)
                this._selectedModelCollection.remove(selectedRow.model);
        },
        render: function () {
            Xero.Views.ViewBase.prototype.render.call(this);

            return this;
        },
        renderRows: function (notClear) {
            var el = $(this.el);
            if (!notClear)
                el.empty();
            _.each(this.model.models, function (model) {
                this.renderRow(model);
            }, this);

            var that = this;
            if (this.xeroOptions.defaultSelection) {
                _.each(this.xeroOptions.defaultSelection, function (item) {
                    that.addSelection(item);
                });

                this.xeroOptions.defaultSelection = null;
            }
        },
        removeRow: function (model) {
        },
        renderRow: function (model, prepend) {
            var el = $(this.el);
            if (this.xeroOptions.rowView) {
                var rowView = new this.xeroOptions.rowView({ model: model, xeroOptions: this.xeroOptions });
                this._rowViewCollection.add(rowView);

                if (prepend)
                    el.prepend(rowView.render().el);
                else
                    el.append(rowView.render().el);
            } else {
                if (prepend)
                    el.prepend('Unknown row');
                else
                    el.append('Unknown row');
            }
        }
    });

    Xero.Views.ViewAppBase = Xero.Views.ViewBase.extend({
        xeroOptions: {
        },
        initialize: function (args) {
            Xero.Views.ViewBase.prototype.initialize.call(this, args);

            if (args && args.xeroOptions) {
                var xeroOptionsNew = _.extend({}, this.xeroOptions, args.xeroOptions);
                this.xeroOptions = xeroOptionsNew;
            }
        }
    });

    Xero.Views.PopupLink = Xero.Views.ViewBase.extend({
        xeroOptions: {
            headerText: 'Header',
            buttons: [{ text: 'Ok', event: 'ok', id: 'xeroModalOKButton', class: 'boss-btn blue-bg white', IsAutoClose: true }, { text: 'Cancel', event: 'cancel', id: 'xeroModalCancelButton', class: 'boss-btn cancel', IsAutoClose: true }],
            id: 'PopupLink',
            generateHyperLink: false,
            generateHyperLinkText: 'Select',
            generateHyperLinkClass: 'boss-btn blue-bg white',
            isAnimate: true,
            content: null,
            modalClass: '',
            fullscreen: false,
            fullscreenMargins: [20, 20],
            position: [200, 200],
            minWidth: 0,
            dimensions: [50, 50] // (x px, y px)
            
        },

        initialize: function (args) {
            this.args = args || {};
            
            this.template = '{{#generateHyperLink}}<a data-target="#{{id}}" role="button" class="{{generateHyperLinkClass}}" data-toggle="modal">{{generateHyperLinkText}}</a>\n{{/generateHyperLink}}';
            this.templatePopup = '<div class="modal hide {{modalClass}} {{#isAnimate}}fade{{/isAnimate}}" id="{{id}}" ';
            this.templatePopup += ' tabindex="-1" role="dialog" aria-labelledby="xeroModalLabel" aria-hidden="true" data-backdrop="static">' +
                '<div class="modal-body-wrap">' +
                    '<div class="modal-header clearfix">' +
                        '<h3 id="xeroModalLabel">{{headerText}}</h3>' +
                        '<button type="button" class="close xeroButtonModal" data-dismiss="modal" aria-hidden="true"> </button>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                    '<div class="modal-body"></div>' +
                    '<div class="modal-footer">' +
                        '{{#buttons}}' +
                        '<button class="{{class}} xeroButtonModal" id="{{id}}" {{#IsAutoClose}}data-dismiss="modal" aria-hidden="true"{{/IsAutoClose}} {{#IsDisabled}}disabled{{/IsDisabled}}>{{text}}</button>' +
                        '{{/buttons}}' +
                    '</div>' +
                '</div>' +
            '</div>';
            this.template += this.templatePopup;
            args.template = this.template;

            Xero.Views.ViewBase.prototype.initialize.call(this, args);
        },
        events: {
            'click button.xeroButtonModal': function (event) {
                var clickedButton = _.find(this.xeroOptions.buttons, function (button) { return (button.id == event.target.id); });
                if (clickedButton)
                    this.trigger(clickedButton.event, event);
            },
            'shown': 'showBody'
        },
        showBody: function (event) {
            var modal = $(this.el).find('.modal');

            if (this.args.xeroOptions.fullscreen) {
                var width = $(window).width() - this.args.xeroOptions.fullscreenMargins[0];
                var height = $(window).height() - this.args.xeroOptions.fullscreenMargins[1];
                var marginTop = -1 * height / 2;
                var marginLeft = -1 * width / 2;
                modal.css('height', height).css('width', width).css('margin-top', marginTop).css('margin-left', marginLeft);
            } else {
                modal.css('min-width', this.args.xeroOptions.minWidth + 'em');
            }
            
            if (this.renderOptions.ContainerClass)
                $(modal).parent().attr('class', this.renderOptions.ContainerClass);
        
            if (!this.isRendered) {
                // There is a problem when the Popup Link is re-rendered which is triggered by an update in the model
                // the ViewBase renders the PopUp but this isRendered property hasn't been reset to FALSE so the content
                // is not rendered when ShowBody is called afterwards.
                // Suggest rename 'isRendered' to 'isBodyRendered' or 'isContentRendered'
                // and reset this value after render is called.
                // Please see above 'render' function as a suggested solution.
                this.isRendered = true;
                this.renderBody();
            }

            $('#topic-picker-body').children().toggleClass('extend-filters');
        },
        renderBody: function () {
            var bodyElement = this.$el.find('#' + this.xeroOptions.id + ' .modal-body');
            if (this.xeroOptions.content) {
                if (this.xeroOptions.content.$el) {
                    bodyElement.html(this.xeroOptions.content.render().el);
                } else if (typeof this.xeroOptions.content === 'string') {
                    if (this.xeroOptions.content.charAt(0) == '#')
                        bodyElement.html($(this.xeroOptions.content).html());
                    else
                        bodyElement.html(this.xeroOptions.content);
                }
            } else if (this.xeroOptions.contentTemplateName)
                var context = { model: this.model, templateName: this.xeroOptions.contentTemplateName, renderOptions: this.renderOptions };
            bodyElement.html(new Xero.Views.ViewBase(context).render().$el.html());
        }
    });

    //Xero.Views.Grid = Xero.Views.ViewBase.extend({
    //    xeroOptions: {
    //        searchable: false,
    //        searchField: null,
    //        showRowSelector: false,
    //        showHierarchyGrid: false,
    //        showHeader: true,
    //        showFooter: false,
    //        gridClass: 'table table-striped table-bordered table-hover table-condensed',
    //        showHeaderAlways: false,
    //        noRowMessage: 'There is not item to display',
    //        classEmptyTable: 'emptyTable',
    //        columns: []
    //    },
    //    events: {
    //        'click tbody tr.xeroTableRow': 'handleSelectGridRow',
    //        'click #buttonSearch': 'handleClickSearchButton',
    //        'click #page-left': function () {
    //            var that = this;
    //            Xero.View.UI.Progress(that.$el, true);
    //            //that.$el.addClass('data-loading');
    //            this.model.requestPreviousPage().always(function () {
    //                Xero.View.UI.Progress(that.$el, false);
    //                //that.$el.removeClass('data-loading');
    //            });
    //        },
    //        'click #page-right': function () {
    //            var that = this;
    //            Xero.View.UI.Progress(that.$el, true);
    //            //that.$el.addClass('data-loading');
    //            this.model.requestNextPage().always(function () {
    //                Xero.View.UI.Progress(that.$el, false);
    //                //that.$el.removeClass('data-loading');
    //            });
    //        },
    //        'click li.page-selector': function (e) {
    //            var value = e.currentTarget.value;
    //            if (value) {
    //                var that = this;
    //                Xero.View.UI.Progress(that.$el, true);
    //                //that.$el.addClass('data-loading');
    //                this.model.goTo(value - 1).always(function () {
    //                    Xero.View.UI.Progress(that.$el, false);
    //                    //that.$el.removeClass('data-loading');
    //                });
    //            }
    //        }
    //        //'click #rowSelector': 'handleClickRowSelector'
    //    },
    //    selectedModelCollection: null,
    //    initialize: function (args) {
    //        args = args || {};
    //        args.xeroOptions = args.xeroOptions || {};
    //        args.xeroOptions.doNotUseAutoRendering = true; //we do not need change event to render grid Body

    //        Xero.Views.ViewBase.prototype.initialize.call(this, args);

    //        this.selectedModelCollection = new Xero.Models.ModelCollectionBase();

    //        var self = this;
    //        this.model.bind("reset", this.renderRows, this);
    //        this.model.bind("add", function (model) {
    //            self.renderRow(model);
    //        });

    //        this.model.bind("remove", function (model) {
    //            self.removeRow(model);
    //        });

    //        if (this.model.pagingInfo) {
    //            this.model.pagingInfo.on('change:perPage', function () {
    //                this.renderFooter();
    //                this.renderFooterContentByNavigation();
    //            }, this);

    //            this.model.pagingInfo.on('change:totalCount', function () {
    //                this.renderFooter();
    //                this.renderFooterContentByNavigation();
    //            }, this);

    //            this.model.pagingInfo.on('change:totalPage', function () {
    //                this.renderFooter();
    //                this.renderFooterContentByNavigation();
    //            }, this);

    //            this.model.pagingInfo.on('change:currentPage', function () {
    //                this.renderFooter();
    //                this.renderFooterContentByNavigation();
    //            }, this);
    //        }
    //    },
    //    render: function () {
    //        var templateTable = '{{#showFooter}}<img class="tree-loading-img" src="' + Xero.UrlFactory("BossContent/Images/spinner.gif")  + '"/>{{/showFooter}}<table class="{{gridClass}}"></table>';
    //        this.elementGrid = $(Mustache.to_html(templateTable, { gridClass: this.xeroOptions.gridClass, showFooter: this.xeroOptions.showFooter }));
    //        this.renderRows();
    //        if (this.xeroOptions.searchable) {
    //            $(this.el).append('<form class="form-search"><div class="input-append "><input type="text" class="span2 search-query" placeholder="Search something…" id="inputSearch" ><button type="button" class="close btn">x</button><button type="button" id="buttonSearch" class="btn">Search</button></div></form>');
    //        }
    //        $(this.el).append(this.elementGrid);
    //        return this;
    //    },
    //    renderEmpty: function () {
    //        if (this.model.models.length == 0) {
    //            if ($(this.el).find('#spanEmptyMessage').length == 0) {
    //                $(this.el).prepend(Mustache.to_html('<span id="spanEmptyMessage" class="{{classEmptyTable}}">{{noRowMessage}}</td></tr></tbody>', { noRowMessage: this.xeroOptions.noRowMessage, classEmptyTable: this.xeroOptions.classEmptyTable }));
    //            }
    //            this.$el.find('tbody').remove();
    //        } else { //if there is a row
    //            if ($(this.el).find('#spanEmptyMessage').length > 0) {
    //                $(this.el).find("#spanEmptyMessage").remove();
    //            }
    //        }
    //    },
    //    renderHeader: function () {
    //        if (this.elementGrid) {
    //            if (this.elementGrid.find('thead').length == 0) {
    //                if (this.xeroOptions.showHeader) {
    //                    if (this.model.models.length != 0 || this.xeroOptions.showHeaderAlways) {
    //                        var templateHeader = '<thead><tr>{{#showRowSelector}}<th id="rowSelector" class="rowSelector"></th>{{/showRowSelector}}{{#columns}}<th class="xeroColumn{{ name }} {{classNameHeader}} {{^classNameHeader}}{{class}}{{/classNameHeader}}"><span class="xeroField{{ name }}">{{ title }}</span></th>{{/columns}}</tr></thead>';
    //                        var context = { columns: this.xeroOptions.columns, showRowSelector: this.xeroOptions.showRowSelector || this.xeroOptions.showHierarchyGrid };

    //                        this.elementGrid.append(Mustache.to_html(templateHeader, context));
    //                    }
    //                }
    //            } else { //if we have header
    //                if (this.model.models.length == 0 && !this.xeroOptions.showHeaderAlways) {
    //                    this.elementGrid.find('thead').remove();
    //                }
    //            }
    //        }
    //    },
    //    renderFooter: function () {
    //        if (this.xeroOptions.showFooter) {
    //            if (this.elementGrid) {
    //                if (this.model.models.length == 0) {
    //                    this.elementGrid.find('tfoot').remove();
    //                } else {
    //                    if (this.elementGrid.find('tfoot').length == 0) {
    //                        this.elementGrid.append('<tfoot></tfoot>');
    //                        this.renderFooterContentByNavigation();
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    renderFooterContentByNavigation: function () {
    //        if (this.xeroOptions.showFooter) {
    //            if (this.elementGrid) {
    //                if (this.elementGrid.find('tfoot').length > 0) {
    //                    if (this.model.pagingInfo) {
    //                        var context = this.model.pagingInfo.toJSON();
    //                        context.middlePagesNavigation = _.range(Math.max(0, Math.min(context.currentPage - 3, context.totalPages - 7)) + 1, Math.min(context.totalPages, Math.max(context.currentPage + 3, 6) + 1) + 1);
    //                        context.firstPagesNavigation = [1];
    //                        context.lastPagesNavigation = [context.totalPages];

    //                        context.lastPagesNavigation = _.difference(context.lastPagesNavigation, context.middlePagesNavigation);
    //                        context.firstPagesNavigation = _.difference(context.firstPagesNavigation, context.middlePagesNavigation);
    //                        if (context.firstPagesNavigation[context.firstPagesNavigation.length - 1] == context.middlePagesNavigation[0] - 1) {
    //                            context.middlePagesNavigation = _.union(context.firstPagesNavigation, context.middlePagesNavigation);
    //                            context.firstPagesNavigation = [];
    //                        }
    //                        if (context.lastPagesNavigation[0] == context.middlePagesNavigation[context.middlePagesNavigation.length - 1] + 1) {
    //                            context.middlePagesNavigation = _.union(context.middlePagesNavigation, context.lastPagesNavigation);
    //                            context.lastPagesNavigation = [];
    //                        }

    //                        context.middlePagesNavigation[_.indexOf(context.middlePagesNavigation, context.currentPage + 1)] = { PageNo: context.currentPage + 1, IsActive: true };

    //                        var templateFooter = '<tr><td colspan="2">\n\
    //                            <div id="paging-controls">\n\
    //                                <div id="ComboBoxPageNumber" class="pagination" style="display: inline-block;"> <span class="paging-label">Page</span> \n\
    //                                <ul>\n\
    //                                {{#firstPagesNavigation}}<li value="{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}" class="page-selector {{#IsActive}}active{{/IsActive}}"><a href="#">{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}</a></li>{{/firstPagesNavigation}}\n\
    //                                {{#firstPagesNavigation}}<li class="disabled"><a href="#">...</a></li>{{/firstPagesNavigation}}\n\
    //                                {{#middlePagesNavigation}}<li value="{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}" class="page-selector {{#IsActive}}active{{/IsActive}}"><a href="#">{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}</a></li>{{/middlePagesNavigation}}\n\
    //                                {{#lastPagesNavigation}}<li class="disabled"><a href="#">...</a></li>{{/lastPagesNavigation}}\n\
    //                                {{#lastPagesNavigation}}<li value="{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}" class="page-selector {{#IsActive}}active{{/IsActive}}"><a href="#">{{#PageNo}}{{PageNo}}{{/PageNo}}{{^PageNo}}{{.}}{{/PageNo}}</a></li>{{/lastPagesNavigation}}\n\
    //                                </ul>\n\
    //                                </div>\n\
    //                                <div id="paging-prev-next" style="display: inline-block;"><span id="page-left"></span><span id="page-divider"></span><span id="page-right"></span></div>\n\
    //                            </div></td></tr>';
    //                        this.elementGrid.find('tfoot').html(Mustache.to_html(templateFooter, context));

    //                        //var pageNumbers = _.range(1, Math.min(context.totalPages + 1, 3)); //new Xero.Models.ModelCollectionBase(_.range(1, context.totalPages));

    //                        //var comboBoxPageNumber = new Xero.Views.ComboBox({ model: pageNumbers, xeroOptions: { titleField: '.', isChosenCombobox: true} });

    //                        //this.elementGrid.find('tfoot').find('#ComboBoxPageNumber').html(comboBoxPageNumber.render().el);
    //                        //this.elementGrid.find('tfoot').find('#ComboBoxPageNumber .chzn-select').chosen({ disable_search:  false, allow_single_deselect: true });
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    renderFooterContentByComboBox: function () {
    //        if (this.xeroOptions.showFooter) {
    //            if (this.elementGrid) {
    //                if (this.elementGrid.find('tfoot').length > 0) {
    //                    if (this.model.pagingInfo) {
    //                        var context = this.model.pagingInfo.toJSON();
    //                        var templateFooter = '<tr><td colspan="2"><div>\n\
    //                            <div id="paging-controls"><span>Page</span><div id="ComboBoxPageNumber"><select  class="chzn-select"></select></div><span>of {{totalPages}}</span></div>\n\
    //                            <div id="paging-description"><span>{{totalCount}} Search Results</span></div>\n\
    //                            <div id="paging-prev-next"><span id="page-left"></span><span id="page-divider"></span><span id="page-right"></span></div>\n\
    //                            </div></td></tr>';
    //                        this.elementGrid.find('tfoot').html(Mustache.to_html(templateFooter, context));
    //                        var pageNumbers = _.range(1, context.totalPages + 1); //new Xero.Models.ModelCollectionBase(_.range(1, context.totalPages));
    //                        var comboBoxPageNumber = new Xero.Views.ComboBox({ model: pageNumbers, xeroOptions: { titleField: '.', isChosenCombobox: true } });

    //                        this.elementGrid.find('tfoot').find('#ComboBoxPageNumber').html(comboBoxPageNumber.render().el);
    //                        //this.elementGrid.find('tfoot').find('#ComboBoxPageNumber .chzn-select').chosen({ disable_search:  false, allow_single_deselect: true });
    //                    }
    //                }
    //            }
    //        }
    //    },
    //    renderRows: function () {
    //        if (this.elementGrid) {
    //            this.elementGrid.find('tbody tr').remove(); //.empty();
    //            this.renderHeader();
    //            this.renderFooter();
    //            this.renderEmpty();

    //            _.each(this.model.models, function (model) {
    //                this.renderRow(model, true);
    //            }, this);
    //        }
    //    },
    //    removeRow: function (model) {
    //        this.renderHeader();
    //        this.renderFooter();
    //        this.renderEmpty();

    //        if (this.selectedModelCollection.contains(model))
    //            this.selectedModelCollection.remove(model);

    //        var el = $(this.el);
    //        if (model) {
    //            el.find('tr#' + model.cid).remove();
    //        }
    //    },
    //    renderRow: function (model, notHeaderCheck) {
    //        //if (!notHeaderCheck) {
    //        this.renderHeader();
    //        this.renderFooter();
    //        this.renderEmpty();
    //        //}
    //        this.elementGrid.append(new Xero.Views.GridRow({ model: model, xeroOptions: { columns: this.xeroOptions.columns, showRowSelector: this.xeroOptions.showRowSelector, showHierarchyGrid: this.xeroOptions.showHierarchyGrid } }).render().el);
    //    },
    //    handleSelectGridRow: function (args) {
    //        $(args.currentTarget).addClass('success').siblings().removeClass('success');
    //        if (!this.xeroOptions.multiSelect)
    //            this.selectedModelCollection.removeAll();
    //        if (this.model.getByCid(args.currentTarget.id))
    //            this.selectedModelCollection.add(this.model.getByCid(args.currentTarget.id));
    //    },
    //    handleClickSearchButton: function (args) {
    //        var value = $(this.el).find('#inputSearch').val();
    //        if (value) {
    //            if (!this.xeroOptions.searchField)
    //                this.xeroOptions.searchField = this.xeroOptions.columns[0].name;
    //            this.model.filter({ FilterName: this.xeroOptions.searchField, FilterValue: value });
    //        } else {
    //            this.model.filter();
    //        }
    //    }
    //});

    //Xero.Views.GridRow = Xero.Views.ViewBase.extend({
    //    tagName: "tr",
    //    className: "xeroTableRow",
    //    events: {
    //        'click #rowSelector': 'handleClickRowSelector'
    //    },
    //    initialize: function (args) {
    //        Xero.Views.ViewBase.prototype.initialize.call(this, args);
    //        if (!this.template) {
    //            this.template = '{{#showRowSelector}}<td id="rowSelector" class="rowSelector">[[#hasChildren]]+[[/hasChildren]][[^hasChildren]]-[[/hasChildren]]</td>{{/showRowSelector}}{{#columns}}<td class="xeroColumn{{ name }} {{class}}"><span class="xeroField{{ name }}">{{{template}}}{{^template}}[[{{ name }}]]{{/template}}</span></td>{{/columns}}\
    //            [[#hasChildren]]<tr id="nestedRow" class="hidden"><td>-</td><td colspan="{{columnCount}}" id="nestedColumn"></td></tr>[[/hasChildren]]';
    //            //this.template = '{{#showRowSelector}}<div id="rowSelector" class="span1 rowSelector">+</div>{{/showRowSelector}}{{#columns}}<div class="span2 xeroColumn{{ name }}"><span class="xeroField{{ name }}">[[{{ name }}]]</span></div>{{/columns}}';
    //            var context = { objectName: this.xeroOptions.name, columns: this.xeroOptions.columns, showRowSelector: this.xeroOptions.showRowSelector || this.xeroOptions.showHierarchyGrid, columnCount: this.xeroOptions.columns.length };
    //            this.template = Mustache.to_html(this.template, context);
    //            this.template = this.template.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
    //        }
    //        this.model.bind("change", this.render, this);
    //        this.model.bind("destroy", this.close, this);
    //    },
    //    render: function () {
    //        var that = this;

    //        var context = _.extend(that.model.toJSON(), { cid: that.model.cid, hasChildren: this.model.hasChildren() });
    //        $(that.el).html(Mustache.to_html(that.template, context));
    //        $(that.el).attr('id', that.model.cid);
    //        return this;
    //    },
    //    handleClickRowSelector: function (args) {
    //        if (this.xeroOptions.showHierarchyGrid && this.model && this.model.hasChildren() && !this.ViewTree) {
    //            var modelTree = this.model.getHierarchyModel();
    //            this.ViewTree = new Xero.Views.GridTopic({ model: modelTree, xeroOptions: { searchable: false } });
    //            var cc = this.$el.find("#nestedColumn");
    //            cc.append(this.ViewTree.render().el);

    //            var dd = this.$el.find("#nestedRow");
    //            dd.removeClass('hidden');
    //            var ee = this.$el.siblings().find("#nestedRow");
    //            ee.addClass('hidden');

    //            $(args.currentTarget).addClass('success').siblings().removeClass('success');
    //        }
    //    }
    //});

});
