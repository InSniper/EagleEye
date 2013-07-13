define(['EEye.Views', 'EEye.Configs'], function (views, configs) {
    "option explicit";

    configs.ListItem = {
        templateInfo: {
            id: 'TemplateListItem',
        }
    };

    configs.List = {
        templateInfo: { id: 'TemplateList' },
    };

    views.ListItem = views.ItemView.extend({
        tagName: 'li',
        defaultConfig: configs.ListItem
    });

    views.List = views.CompositeView.extend({
        tagName: 'ul',
        itemView: views.ListItem,
        defaultConfig: configs.List,
    });

    return (views);
});
