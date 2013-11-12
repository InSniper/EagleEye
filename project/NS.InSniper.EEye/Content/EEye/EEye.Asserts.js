define(['EEye.Base'], function (base) {
    'use strict';

    var asserts = base.namespace('EEye.Asserts');

    asserts.NotNull = function (arg) {
        return arg ? true : false;
    };

    asserts.throwError = function (message, name) {
        var error = new Error(message);
        error.name = name || 'Error';
        throw error;
    };

    return asserts;
});
