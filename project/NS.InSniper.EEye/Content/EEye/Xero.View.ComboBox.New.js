define(['jquery', 'underscore', 'backbone', 'mustache','Xero.Base','Xero.View.Base'], function($, _, Backbone, Mustache,Xero) {
    'use strict';
   
    Xero.ns('Xero.View');

    Xero.Views.ComboBoxView = Xero.Views.View.extend({
        className:"chzn-container chzn-container-single chzn-container-single-nosearch",
        initialize: function(options) {
            this.itemViewOptions = this.itemViewOptions || { };

            if (!options.templateItem) {
                options.templateItem = '{{Name}}';
            }

            if (!options.templateSelectedItem) {
                options.templateSelectedItem = options.templateItem;
            }

            this.itemViewOptions.TemplateComboBoxItem = "xTemplateComboBoxItem" + this.cid;
            Backbone.Marionette.TemplateCache.registerTemplate(this.itemViewOptions.TemplateComboBoxItem, options.templateItem);

            Backbone.Marionette.TemplateCache.registerTemplate("xTemplateComboBox" + this.cid, "<a tabindex='-1' href='javascript:void(0)'><span class='selectedText' id='" + this.cid + "_{{Id}}'>" + options.templateSelectedItem + "</span></a>");

            Xero.Views.View.prototype.initialize.call(this, arguments);
        }
    });

    Xero.Views.ComboBoxViewItem = Xero.Views.ItemView.extend({
        tagName: "li",
        className: "active-result combobox-option",
        initialize: function(options) {
            Xero.Views.ItemView.prototype.initialize.call(this, arguments);
            this.template = options.TemplateComboBoxItem;
        }
    });
    
    <div>
    <div id="ComboBoxAnswersInConversation_chzn" class="chzn-container chzn-container-single chzn-container-single-nosearch" style="width: 220px;"><a tabindex="-1" class="chzn-single" href="javascript:void(0)"><span class="selectedText">Answers (4)</span><div><b></b></div>
    </a>
        <div style="left: -9000px; width: 218px; top: 24px;" class="chzn-drop">
            <div class="chzn-search">
                <input type="text" autocomplete="off" style="width: 183px;"></div>
            <ul class="chzn-results">
                <li style="" class="active-result result-selected combobox-option" id="ComboBoxAnswersInConversation_chzn_o_0">Answers (4)</li>
                <li style="" class="active-result combobox-option" id="ComboBoxAnswersInConversation_chzn_o_1">Using the expense claim flag on the account code</li>
                <li style="" class="active-result combobox-option" id="ComboBoxAnswersInConversation_chzn_o_2">Advice on Chart of Accounts</li>
                <li style="" class="active-result combobox-option" id="ComboBoxAnswersInConversation_chzn_o_3">Defining your Chart of Accounts</li>
                <li style="" class="active-result combobox-option" id="ComboBoxAnswersInConversation_chzn_o_4">Entering a part payment</li>
            </ul>
        </div>
    </div>
    </div>


});