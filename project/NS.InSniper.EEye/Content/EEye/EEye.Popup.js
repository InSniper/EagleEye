define(['EEye.Views', 'EEye.Configs'], function (views, configs) {
    "option explicit";

    configs.Popup = {
        templateInfo: {
            id: 'TemplatePopupItem',
        },
        className: 'k-list-container k-popup k-group k-reset',
        style: 'height: auto; display: none; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-style: normal; font-weight: normal; line-height: normal; width: 142.796875px; position: absolute; -webkit-transform: translateY(-98px);',
    };

    

    views.Popup = views.Layout.extend({
        tagName: 'div',
        defaultConfig: configs.Popup
    });

    return (views);
});
