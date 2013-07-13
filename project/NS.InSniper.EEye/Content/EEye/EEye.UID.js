define(['EEye.Base'], function (base) {
    "option explicit";

    var uId = base.namespace('EEye.UId');
    uId.lastUId = 0;
    uId.NewUId = function () {
        uId.lastUId = uId.lastUId + 1;
        return (uId.lastUId);
    };

    return (uId);
});
