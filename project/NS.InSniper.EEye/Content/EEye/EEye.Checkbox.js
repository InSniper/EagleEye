define(['EEye.Views', 'EEye.JQuery', 'EEye.Configs'], function (views, jquery, configs) {
    "option explicit";

    configs.CheckBox = {
        templateInfo: {
            //id: 'TemplateCheckBoxItem',
            //we can use "&#123;{" except changing delima
            content: '{{=<% %>=}}<input <%#valueField%>id="CheckBox_Input_{{<%valueField%>}}_{{viewId}}"<%/valueField%> type="checkbox" <%#isSelected%>checked="checked"<%/isSelected%>/><label <%#valueField%>for="CheckBox_Input_{{<%valueField%>}}_{{viewId}}"<%/valueField%> <%#valueField%>id="CheckBox_Label_{{<%valueField%>}}_{{viewId}}"<%/valueField%> data-bind="text: <%textField%>" ><%textTemplate%></label><%={{ }}=%>'
        },
        className: 'eeye-checkbox'
    };

    configs.CheckBoxList = {
        templateInfo: {
            //id: 'TemplateCheckBoxList',
            content: '{{=<% %>=}}{{#.}}<div><input <%#valueField%>id="CheckBox_Input_{{<%valueField%>}}_{{viewId}}"<%/valueField%> type="checkbox" <%#isSelected%>checked="checked"<%/isSelected%>/><label <%#valueField%>for="CheckBox_Input_{{<%valueField%>}}_{{viewId}}"<%/valueField%> <%#valueField%>id="CheckBox_Label_{{<%valueField%>}}_{{viewId}}"<%/valueField%> data-bind="text: <%textField%>" ><%textTemplate%></label></div>{{/.}}<%={{ }}=%>'
        },
        className: 'eeye-checkbox-list'
    };

    views.CheckBox = views.ItemView.extend({
        tagName: "p",
        registeredName: 'CheckBox',
        defaultConfig: configs.CheckBox,
        initialize: function (options) {
            views.ItemView.prototype.initialize.call(this, options);
        },
        events: {
            'change input[type:checkbox]': 'onChange',
        },
        triggers: {
            //'change input[type:checkbox]': 'CheckBox:change',
            //'change input[type:checkbox]:checked': 'CheckBox:Checked',
            //'change input[type:checkbox]:not(:checked)': 'CheckBox:Unchecked'
        },
        onChange:function() {
            if (this.$el.find('input:checkbox').prop('checked')) {
                this.onCheckBoxChecked(this);
            } else {
                this.onCheckBoxUnchecked(this);
            }
            this.triggerMethod('CheckBox:change');
        },
        /*onCheckBoxChange:function(view) {
            if (this.$el.find('input:checkbox').prop('checked')) {
                this.onCheckBoxChecked(view);
            } else {
                this.onCheckBoxUnchecked(view);
            }
        },*/
        onCheckBoxUnchecked: function(view) {
            view.$el.data('value', null);
        },
        onCheckBoxChecked: function(view) {
            view.$el.data('value', this.model);
        },
        value: function (isSelect) {
            if (!_.isUndefined(isSelect)) {
                isSelect = isSelect ? true : false;
                if (this.$el.find('input:checkbox').prop('checked') != isSelect) {
                    this.$el.find('input:checkbox').prop('checked', isSelect);
                    this.onChange(this);
                }
            }
            return (this.$el.find('input:checkbox').prop('checked'));
        }
    });

    views.CheckBoxListItem = views.CheckBox.extend({
        tagName: 'li'
    });

    views.CheckBoxList = views.CompositeView.extend({
        tagName: 'ul',
        registeredName: 'CheckBoxList',
        itemView: views.CheckBoxListItem,
        modelView: views.CheckBox,
        itemViewEventPrefix: 'ItemView',
        defaultConfig: configs.CheckBoxList,
        constructor: function(options) {
            views.CompositeView.prototype.constructor.call(this, options);
        },
        _onItemViewCheckBoxChange: function (view) {
            if (view.value()) {
                this._onItemViewCheckBoxChecked(view);
            } else {
                this._onItemViewCheckBoxUnchecked(view);
            }
        },
        _onItemViewCheckBoxChecked: function(view) {
            if (view) {
                var value = this.value();
                value.push(view.model);
                this.$el.data('value', value);
                this.triggerMethod('CheckBoxList:change');
            }
        },
        _onItemViewCheckBoxUnchecked: function(view) {
            if (view) {
                var value = this.value();
                value = _.reject(value, function(model) { return model == view.model; });
                this.$el.data('value', value);
                this.triggerMethod('CheckBoxList:change');
            }
        },
        _onItemRemoved: function(view) {
            this._onItemViewCheckBoxUnchecked(view);
        },
        value: function (value) {
            if (!value) {
                value = this.$el.data('value');
                if (!value) {
                    value = [];
                    this.$el.data('value', value);
                }
                return (value);
            } else {
                value = _.isArray(value) ? value : [value];
                
                var currentValue = this.value();
                var removingValues = _.difference(currentValue, value);
                var addingValues = _.difference(value, currentValue);

                this.removeValue(removingValues);
                this.addValue(addingValues);

                return (this.value());
            }
        },
        addValue: function (value) {
            if (value) {
                value = _.isArray(value) ? value : [value];
                
                _.each(value, function (model) {
                    var view = this.children.findByModel(model);
                    if (view) {
                        view.value(true);
                    }
                },this);
            }
        },
        removeValue: function (value) {
            if (value) {
                value = _.isArray(value) ? value : [value];
                
                _.each(value, function (model) {
                    var view = this.children.findByModel(model);
                    if (view) {
                        view.value(false);
                    }
                }, this);
            }
        }
    
    });

    jquery.plugin(views.CheckBoxList.prototype.registeredName, views.CheckBoxList);
    jquery.plugin(views.CheckBox.prototype.registeredName, views.CheckBox);


    return (views);
});
