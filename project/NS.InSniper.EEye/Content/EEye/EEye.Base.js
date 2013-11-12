define([], function () {
    'use strict';

    var eEye = window.EEye = window.EEye || {};
    
    var namespace = function (ns) {
        var parts = ("" + ns).split('.'),
            parent = eEye;

        for (var i = (parts[0] == 'EEye' ? 1 : 0), length = parts.length; i < length; i++) {
            var currentPart = parts[i];
            parent[currentPart] = parent[currentPart] || {};
            parent = parent[currentPart];
        }
        return parent;
    };

    var extend = function(target, source) {
        for (var prop in source)
            if (prop in target)
                _.deepObjectExtend(target[prop], source[prop]);
            else
                target[prop] = source[prop];
        return target;
    };

    var base = namespace('EEye.Base');
    base.namespace = namespace;

    return (base);
});

