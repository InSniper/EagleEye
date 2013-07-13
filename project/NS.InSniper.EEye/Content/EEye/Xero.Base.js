define(['underscore', 'backbone'],
    function (_, Backbone) {
        'use strict';

        var namespace = function (name, value) {
            var ns = name.split('.'),
                n = ns.length,
                obj = window,
                i;

            for (i = 0; i < n; i += 1) {
                if (i === n - 1) {
                    obj = obj[ns[i]] = obj[ns[i]] || value || {};
                } else {
                    obj = obj[ns[i]] = obj[ns[i]] || {};
                }
            }

            return obj;
        };

        var Xero = namespace('Xero');
        Xero.ns = namespace;


        Xero.BaseURI = window.siteRoot || "/CustomerCare2.1/";
        Xero.UrlFactory = function (path) {
            if (path && path.length > 0) {
                if (path[0] == "/")
                    path = path.right(path.length - 1);
            }
            return (Xero.BaseURI + path);
        };

        Xero.ns('Xero.Guid');
        Xero.Guid.Empty= '00000000-0000-0000-0000-000000000000';
        Xero.TicketStatusFollowUp = 2;
        Xero.TicketStatusInSniper = 5;

        //because of IE9 behavour in console object
        if (!window.console) window.console = {};
        if (!window.console.log) window.console.log = function () { };





        Xero.ns('Xero.Bases');

        Xero.Bases.Object = function () {
            this.initialize.apply(this, arguments);
        };

        Xero.Bases.ObservableObject = function () {
            this.initialize.apply(this, arguments);
        };

        // Attach all inheritable methods to the Object prototype.
        _.extend(Xero.Bases.Object.prototype, {
            initialize: function () {

            }
        });

        // Attach all inheritable methods to the ObservableObject prototype.
        _.extend(Xero.Bases.ObservableObject.prototype, Backbone.Events, {
            initialize: function () {

            }
        });


        // Shared empty constructor function to aid in prototype-chain creation.
        var ctor = function () {
        };

        // Helper function to correctly set up the prototype chain, for subclasses.
        // Similar to `goog.inherits`, but uses a hash of prototype properties and
        // class properties to be extended.
        var inherits = function (parent, protoProps, staticProps) {
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                child = protoProps.constructor;
            } else {
                child = function () { parent.apply(this, arguments); };
            }

            // Inherit class (static) properties from parent.
            _.extend(child, parent);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Add static properties to the constructor function, if supplied.
            if (staticProps) _.extend(child, staticProps);

            // Correctly set child's `prototype.constructor`.
            child.prototype.constructor = child;

            // Set a convenience property in case the parent's prototype is needed later.
            child.__super__ = parent.prototype;

            return child;
        };

        var extend = function (protoProps, classProps) {
            var child = inherits(this, protoProps, classProps);
            child.extend = this.extend;
            return child;
        };

        // Set up inheritance for the Object and ObservableObject
        Xero.Bases.ObservableObject.extend = Xero.Bases.Object.extend = extend;

        return (Xero);
    });
