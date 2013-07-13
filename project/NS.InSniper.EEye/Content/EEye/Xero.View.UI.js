define(['jquery', 'Xero.Base'], function($) {
    Xero.ns('Xero.View.UI');

    Xero.View.UI.Progress = function(container, toggle) {
        var mask = container.find(".x-loading-mask");

        if (toggle) {
            if (!mask.length) {
                mask = $("<div class='x-loading-mask'><span class='x-loading-text'>Loading...</span><div class='x-loading-image'/><div class='x-loading-color'/></div>")
                    .width("100%").height("100%")
                    .prependTo(container)
                    .css({ top: container.scrollTop(), left: container.scrollLeft() });

                container.addClass('x-loading-parent');
            }
        } else if (mask) {
            mask.remove();
            container.removeClass('x-loading-parent');
        }
    };
    
    Xero.View.UI.ProgressButton = function (container, toggle) {
        //if (container.hasClass('boss-btn')) {
            if (toggle) {
                container.addClass('spinning-button').attr('disabled', true);
            } else {
                container.removeClass('spinning-button').attr('disabled', false);
            }
        //}
    };

    Xero.View.UI.Redirect = function (url, jsonModel) {
        var formGeneratorForObject = function (baseName, objectModel) {
            stForm = "";
            _.each(objectModel, function(value, item) {
                stForm += '<input type="hidden" name="' + baseName + '.' + item + '" value="' + value + '" />';
            });
            return (stForm);
        };

        var stForm = "";
        _.each(jsonModel, function(value, item) {
            if (value && item) {
                if (_.isArray(value)) {
                    _.each(value, function(valueArray, indexArray) {
                        var itemBase = item + '[' + indexArray + ']';
                        if (typeof valueArray === 'object') {
                            stForm += formGeneratorForObject(itemBase, valueArray);
                        } else {
                            stForm += '<input type="hidden" name="' + itemBase + '" value="' + valueArray + '" />';
                        }
                    });
                } else {
                    if (typeof value === 'object') {
                        stForm += formGeneratorForObject(item, value);
                    } else {
                        stForm += '<input type="hidden" name="' + item + '" value="' + value + '" />';
                    }
                }
            }
        });
        stForm = '<form action="' + url + '" method="post">' + stForm;
        stForm += '</form>';
        var form = $(stForm);
        $('body').append(form);
        $(form).submit();
    };

    return (Xero);
});
