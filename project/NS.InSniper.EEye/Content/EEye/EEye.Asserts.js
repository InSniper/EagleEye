define(['EEye.Base'], function (base) {
    "option explicit";

    var asserts = base.namespace('EEye.Asserts');

    asserts.NotNull = function (arg) {
    };

    asserts.throwError = function (message, name) {
        var error = new Error(message);
        error.name = name || 'Error';
        throw error;
    };


    return (asserts);
});
