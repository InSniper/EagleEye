define(['jquery', 'EEye.Base'], function ($, base) {
    'use strict';
    "option explicit";

    var jQuery = base.namespace('EEye.jQuery');

    jQuery.plugin = function (name, type) {
        $.fn[name] = function(options) {
            var result = [];
            this.each(function(index, item) {
                var instance = $(item).data('eeye-instance');
                if (instance) {
                    if (instance instanceof type) {
                    } else {
                        throw 'Type of this DOM object is different from requested type';
                    }
                } else {
                    if (type.prototype.tagName.toUpperCase() == item.nodeName.toUpperCase()) {
                        var tempOptions = _.merge({}, options, { el: $(item) });
                        instance = new type(tempOptions);
                        instance.render();
                    } else {
                        throw "DOM type is not compatible with requested object";
                    }
                }
                result.push(instance);
                return (true);
            });

            if (result.length == 0)
                return (null);
            if (result.length == 1)
                return (result[0]);
            return (result);
        };
    };
    
    return (jQuery);
});
