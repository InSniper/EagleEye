define(['underscore', 'mustache', 'backbone.marionette', 'EEye.Base', 'EEye.UId', 'EEye.Configs'], function (_, mustache, marionette, base, uId, configs) {
    "option explicit";

    var templates = base.namespace('EEye.Templates');

    configs.templateInfo = {
        id: function () {
            var id ="EEye.Templates." + uId.NewUId();
            return(id);
        },
        content: '{{=<% %>=}}<%textTemplate%><%={{ }}=%>',
        valueField: 'id',
        textField: 'text',
        textTemplate: function () {
            return ('{{' + this.textField + '}}');
        }
    };

    _.extend(marionette.TemplateCache.prototype, {
        compileTemplate: function (rawTemplate) {
            return mustache.compile(rawTemplate);
        }
    });

    _.extend(marionette.TemplateCache, {
        registerTemplate: function (template, templateId) {
            var cachedTemplate = this.templateCaches[templateId];

            if (!cachedTemplate) {
                cachedTemplate = new marionette.TemplateCache(templateId);
                this.templateCaches[templateId] = cachedTemplate;

                this.templateCaches[templateId].compiledTemplate = this.templateCaches[templateId].compileTemplate(template);
            }

            return (templateId);
        }
    });


    templates.RegisterTemplate = function (templateInfo) {
        if (typeof templateInfo !== 'string') {

            if (typeof templateInfo.id !== 'string')
                templateInfo.id = templateInfo.id();

            var content = mustache.render(templateInfo.content, templateInfo);


            return (marionette.TemplateCache.registerTemplate(content, templateInfo.id));
        }
        return (templateInfo);
    };

    return (templates);
});
