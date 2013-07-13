define([ 'EEye.Views', 'EEye.Configs', 'EEye.List', 'EEye.Popup'], function ( views, configs) {
    "option explicit";

    configs.ComboBoxHeader = {
        templateInfo: {
            id: 'TemplateComboBoxHeader',
            content: 
                '<span style="width: 400px;" class="k-widget k-combobox k-header">'+
                '    <span tabindex="-1" unselectable="on" class="k-dropdown-wrap k-state-default">'+
                '       <input class="k-input" type="text" autocomplete="off" style="width: 100%;" maxlength="524288" role="combobox" aria-expanded="false" tabindex="0" aria-disabled="false" aria-readonly="false" aria-autocomplete="list" aria-owns="customers_listbox" aria-busy="false" aria-activedescendant="customers_option_selected">'+
                '        <span tabindex="-1" unselectable="on" class="k-select">'+
                '            <span unselectable="on" class="k-icon k-i-arrow-s" role="button" tabindex="-1" aria-controls="customers_listbox">'+
                '            select'+
                '            </span>'+
                '        </span>'+
                '    </span>'+
                '    <input id="customers" style="width: 400px; display: none;" data-role="combobox" aria-disabled="false" aria-readonly="false">'+
                '</span>'
        },
        className: 'ComboBox'
    };

    views.ComboBoxHeader = views.View.extend({
        defaultConfig: configs.ComboBoxHeader,
    });

    configs.ComboBoxItem = {
        templateInfo: {
            id: 'TemplateComboBoxItem',
        },
        className: 'ComboBox-Item'
    };

    views.ComboBoxItem = views.ItemView.extend({
        tagName: 'li',
        defaultConfig: configs.ComboBoxItem
    });

    configs.ComboBoxPopup = {
        templateInfo: {
            id: 'TemplateComboBoxPopup',
            innerViews: [{ viewType: views.List }]
        },
        className: 'ComboBox-Popup'
    };

    views.ComboBoxPopup = views.Popup.extend({
        defaultConfig: configs.ComboBoxPopup
    });

    configs.ComboBox = {
        templateInfo: {
            id: 'TemplateComboBox',
            innerViews: [{ el: '#ComboBox_Header__', viewType: views.ComboBoxHeader }, { el: '#ComboBox_Popup__', viewType:views.ComboBoxPopup }],
            content: '{{=<% %>=}}<div id="ComboBox_Header_{{<%valueField%>}}_{{viewId}}"/><div id="ComboBox_Popup_{{<%valueField%>}}_{{viewId}}"/><%={{ }}=%>'
        },
        className: 'ComboBox'
    };

    views.ComboBox = views.Layout.extend({
        defaultConfig: configs.ComboBox,
    });

    return (views);
});
