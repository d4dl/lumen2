/*
This file is part of Sencha Touch 2.3

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-09-24 16:24:22 (5e4fc2d806d7b959eddaf31a21c4d4837b133e07)
*/
//@tag foundation,core
//@define Ext

/**
 * @class Ext
 * @singleton
 */
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        emptyFn = function(){},
        i;

    if (typeof Ext === 'undefined') {
        global.Ext = {};
    }

    Ext.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    /**
     * An array containing extra enumerables for old browsers.
     * @property {String[]}
     */
    Ext.enumerables = enumerables;

    /**
     * Copies all the properties of config to the specified object.
     * Note that if recursive merging and cloning without referencing the original objects / arrays is needed, use
     * {@link Ext.Object#merge} instead.
     * @param {Object} object The receiver of the properties.
     * @param {Object} config The source of the properties.
     * @param {Object} [defaults] A different object that will also be applied for default values.
     * @return {Object} returns obj
     */
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-',
        scopeResetCSS: false
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {
        /**
         * @property {Function}
         * A reusable empty function
         */
        emptyFn: emptyFn,

        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        /**
         * Copies all the properties of config to object if they don't already exist.
         * @param {Object} object The receiver of the properties.
         * @param {Object} config The source of the properties.
         * @return {Object} returns obj
         */
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        /**
         * Iterates either an array or an object. This method delegates to
         * {@link Ext.Array#each Ext.Array.each} if the given value is iterable, and {@link Ext.Object#each Ext.Object.each} otherwise.
         *
         * @param {Object/Array} object The object or array to be iterated.
         * @param {Function} fn The function to be called for each iteration. See and {@link Ext.Array#each Ext.Array.each} and
         * {@link Ext.Object#each Ext.Object.each} for detailed lists of arguments passed to this function depending on the given object
         * type that is being iterated.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * Defaults to the object being iterated itself.
         */
        iterate: function(object, fn, scope) {
            if (Ext.isEmpty(object)) {
                return;
            }

            if (scope === undefined) {
                scope = object;
            }

            if (Ext.isIterable(object)) {
                Ext.Array.each.call(Ext.Array, object, fn, scope);
            }
            else {
                Ext.Object.each.call(Ext.Object, object, fn, scope);
            }
        }
    });

    Ext.apply(Ext, {

        /**
         * This method deprecated. Use {@link Ext#define Ext.define} instead.
         * @method
         * @param {Function} superclass
         * @param {Object} overrides
         * @return {Function} The subclass constructor from the `overrides` parameter, or a generated one if not provided.
         * @deprecated 2.0.0 Please use {@link Ext#define Ext.define} instead
         */
        extend: function() {
            // inline overrides
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                for (var m in o) {
                    if (!o.hasOwnProperty(m)) {
                        continue;
                    }
                    this[m] = o[m];
                }
            };

            return function(subclass, superclass, overrides) {
                // First we check if the user passed in just the superClass with overrides
                if (Ext.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }

                //<debug>
                if (!superclass) {
                    Ext.Error.raise({
                        sourceClass: 'Ext',
                        sourceMethod: 'extend',
                        msg: 'Attempting to extend from a class which has not been loaded on the page.'
                    });
                }
                //</debug>

                // We create a new temporary class
                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Ext.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Ext.extend(subclass, o);
                };

                return subclass;
            };
        }(),

        /**
         * Proxy to {@link Ext.Base#override}. Please refer {@link Ext.Base#override} for further details.
         *
         * @param {Object} cls The class to override
         * @param {Object} overrides The properties to add to `origClass`. This should be specified as an object literal
         * containing one or more properties.
         * @method override
         * @deprecated 2.0.0 Please use {@link Ext#define Ext.define} instead.
         */
        override: function(cls, overrides) {
            if (cls.$isClass) {
                return cls.override(overrides);
            }
            else {
                Ext.apply(cls.prototype, overrides);
            }
        }
    });

    // A full set of static methods to do type checking
    Ext.apply(Ext, {

        /**
         * Returns the given value itself if it's not empty, as described in {@link Ext#isEmpty}; returns the default
         * value (second argument) otherwise.
         *
         * @param {Object} value The value to test.
         * @param {Object} defaultValue The value to return if the original value is empty.
         * @param {Boolean} [allowBlank=false] (optional) `true` to allow zero length strings to qualify as non-empty.
         * @return {Object} `value`, if non-empty, else `defaultValue`.
         */
        valueFrom: function(value, defaultValue, allowBlank){
            return Ext.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        /**
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         * - `element`: If the given value is a DOM Element
         * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
         * - `whitespace`: If the given value is a DOM text node and contains only whitespace
         *
         * @param {Object} value
         * @return {String}
         */
        typeOf: function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            var typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            //<debug error>
            Ext.Error.raise({
                sourceClass: 'Ext',
                sourceMethod: 'typeOf',
                msg: 'Failed to determine the type of the specified value "' + value + '". This is most likely a bug.'
            });
            //</debug>
        },

        /**
         * Returns `true` if the passed value is empty, `false` otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array.
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`).
         *
         * @param {Object} value The value to test.
         * @param {Boolean} [allowEmptyString=false] (optional) `true` to allow empty strings.
         * @return {Boolean}
         */
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        /**
         * Returns `true` if the passed value is a JavaScript Array, `false` otherwise.
         *
         * @param {Object} target The target to test.
         * @return {Boolean}
         * @method
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        /**
         * Returns `true` if the passed value is a JavaScript Date object, `false` otherwise.
         * @param {Object} object The object to test.
         * @return {Boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        /**
         * Returns 'true' if the passed value is a String that matches the MS Date JSON encoding format
         * @param {String} value The string to test
         * @return {Boolean}
         */
        isMSDate: function(value) {
            if (!Ext.isString(value)) {
                return false;
            } else {
                return value.match("\\\\?/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\\\?/") !== null;
            }
        },

        /**
         * Returns `true` if the passed value is a JavaScript Object, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        /**
         * @private
         */
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        /**
         * Returns `true` if the passed value is a JavaScript 'primitive', a string, number or Boolean.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        /**
         * Returns `true` if the passed value is a JavaScript Function, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isFunction:
        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
        // Object.prorotype.toString (slower)
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        /**
         * Returns `true` if the passed value is a number. Returns `false` for non-finite numbers.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        /**
         * Validates that a value is numeric.
         * @param {Object} value Examples: 1, '1', '2.34'
         * @return {Boolean} `true` if numeric, `false` otherwise.
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * Returns `true` if the passed value is a string.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * Returns `true` if the passed value is a Boolean.
         *
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        /**
         * Returns `true` if the passed value is an HTMLElement.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        /**
         * Returns `true` if the passed value is a TextNode.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        /**
         * Returns `true` if the passed value is defined.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        /**
         * Returns `true` if the passed value is iterable, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isIterable: function(value) {
            return (value && typeof value !== 'string') ? value.length !== undefined : false;
        }
    });

    Ext.apply(Ext, {

        /**
         * Clone almost any type of variable including array, object, DOM nodes and Date without keeping the old reference.
         * @param {Object} item The variable to clone.
         * @return {Object} clone
         */
        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            // DOM nodes
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            // Strings
            var type = toString.call(item);

            // Dates
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Arrays
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            // Objects
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        /**
         * @private
         * Generate a unique reference of Ext in the global scope, useful for sandboxing.
         */
        getUniqueGlobalNamespace: function() {
            var uniqueGlobalNamespace = this.uniqueGlobalNamespace;

            if (uniqueGlobalNamespace === undefined) {
                var i = 0;

                do {
                    uniqueGlobalNamespace = 'ExtBox' + (++i);
                } while (Ext.global[uniqueGlobalNamespace] !== undefined);

                Ext.global[uniqueGlobalNamespace] = Ext;
                this.uniqueGlobalNamespace = uniqueGlobalNamespace;
            }

            return uniqueGlobalNamespace;
        },

        /**
         * @private
         */
        functionFactory: function() {
            var args = Array.prototype.slice.call(arguments),
                ln = args.length;

            if (ln > 0) {
                args[ln - 1] = 'var Ext=window.' + this.getUniqueGlobalNamespace() + ';' + args[ln - 1];
            }

            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        /**
         * @private
         */
        globalEval: ('execScript' in global) ? function(code) {
            global.execScript(code)
        } : function(code) {
            (function(){
                eval(code);
            })();
        }

        //<feature logger>
        /**
         * @private
         * @property
         */
        ,Logger: {
            log: function(message, priority) {
                if ('console' in global) {
                    if (!priority || !(priority in global.console)) {
                        priority = 'log';
                    }
                    message = '[' + priority.toUpperCase() + '] ' + message;
                    global.console[priority](message);
                }
            },
            verbose: function(message) {
                this.log(message, 'verbose');
            },
            info: function(message) {
                this.log(message, 'info');
            },
            warn: function(message) {
                this.log(message, 'warn');
            },
            error: function(message) {
                throw new Error(message);
            },
            deprecate: function(message) {
                this.log(message, 'warn');
            }
        }
        //</feature>
    });

    /**
     * Old alias to {@link Ext#typeOf}.
     * @deprecated 2.0.0 Please use {@link Ext#typeOf} instead.
     * @method
     * @alias Ext#typeOf
     */
    Ext.type = Ext.typeOf;

})();

//@tag foundation,core
//@define Ext.Version
//@require Ext

/**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Version
 *
 * A utility class that wrap around a string version number and provide convenient
 * method to perform comparison. See also: {@link Ext.Version#compare compare}. Example:
 *
 *     var version = new Ext.Version('1.0.2beta');
 *     console.log("Version is " + version); // Version is 1.0.2beta
 *
 *     console.log(version.getMajor()); // 1
 *     console.log(version.getMinor()); // 0
 *     console.log(version.getPatch()); // 2
 *     console.log(version.getBuild()); // 0
 *     console.log(version.getRelease()); // beta
 *
 *     console.log(version.isGreaterThan('1.0.1')); // true
 *     console.log(version.isGreaterThan('1.0.2alpha')); // true
 *     console.log(version.isGreaterThan('1.0.2RC')); // false
 *     console.log(version.isGreaterThan('1.0.2')); // false
 *     console.log(version.isLessThan('1.0.2')); // true
 *
 *     console.log(version.match(1.0)); // true
 *     console.log(version.match('1.0.2')); // true
 */
(function() {

// Current core version
var version = '4.1.0', Version;
    Ext.Version = Version = Ext.extend(Object, {

        /**
         * Creates new Version object.
         * @param {String/Number} version The version number in the follow standard format: major[.minor[.patch[.build[release]]]]
         * Examples: 1.0 or 1.2.3beta or 1.2.3.4RC
         * @return {Ext.Version} this
         */
        constructor: function(version) {
            var toNumber = this.toNumber,
                parts, releaseStartIndex;

            if (version instanceof Version) {
                return version;
            }

            this.version = this.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');

            releaseStartIndex = this.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                this.release = this.version.substr(releaseStartIndex, version.length);
                this.shortVersion = this.version.substr(0, releaseStartIndex);
            }

            this.shortVersion = this.shortVersion.replace(/[^\d]/g, '');

            parts = this.version.split('.');

            this.major = toNumber(parts.shift());
            this.minor = toNumber(parts.shift());
            this.patch = toNumber(parts.shift());
            this.build = toNumber(parts.shift());

            return this;
        },

        /**
         * @param {Number} value
         * @return {Number}
         */
        toNumber: function(value) {
            value = parseInt(value || 0, 10);

            if (isNaN(value)) {
                value = 0;
            }

            return value;
        },

        /**
         * Override the native `toString()` method.
         * @private
         * @return {String} version
         */
        toString: function() {
            return this.version;
        },

        /**
         * Override the native `valueOf()` method.
         * @private
         * @return {String} version
         */
        valueOf: function() {
            return this.version;
        },

        /**
         * Returns the major component value.
         * @return {Number} major
         */
        getMajor: function() {
            return this.major || 0;
        },

        /**
         * Returns the minor component value.
         * @return {Number} minor
         */
        getMinor: function() {
            return this.minor || 0;
        },

        /**
         * Returns the patch component value.
         * @return {Number} patch
         */
        getPatch: function() {
            return this.patch || 0;
        },

        /**
         * Returns the build component value.
         * @return {Number} build
         */
        getBuild: function() {
            return this.build || 0;
        },

        /**
         * Returns the release component value.
         * @return {Number} release
         */
        getRelease: function() {
            return this.release || '';
        },

        /**
         * Returns whether this version if greater than the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if greater than the target, `false` otherwise.
         */
        isGreaterThan: function(target) {
            return Version.compare(this.version, target) === 1;
        },

        /**
         * Returns whether this version if greater than or equal to the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if greater than or equal to the target, `false` otherwise.
         */
        isGreaterThanOrEqual: function(target) {
            return Version.compare(this.version, target) >= 0;
        },

        /**
         * Returns whether this version if smaller than the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if smaller than the target, `false` otherwise.
         */
        isLessThan: function(target) {
            return Version.compare(this.version, target) === -1;
        },

        /**
         * Returns whether this version if less than or equal to the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if less than or equal to the target, `false` otherwise.
         */
        isLessThanOrEqual: function(target) {
            return Version.compare(this.version, target) <= 0;
        },

        /**
         * Returns whether this version equals to the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version equals to the target, `false` otherwise.
         */
        equals: function(target) {
            return Version.compare(this.version, target) === 0;
        },

        /**
         * Returns whether this version matches the supplied argument. Example:
         *
         *     var version = new Ext.Version('1.0.2beta');
         *     console.log(version.match(1)); // true
         *     console.log(version.match(1.0)); // true
         *     console.log(version.match('1.0.2')); // true
         *     console.log(version.match('1.0.2RC')); // false
         *
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version matches the target, `false` otherwise.
         */
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        /**
         * Returns this format: [major, minor, patch, build, release]. Useful for comparison.
         * @return {Number[]}
         */
        toArray: function() {
            return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
        },

        /**
         * Returns shortVersion version without dots and release.
         * @return {String}
         */
        getShortVersion: function() {
            return this.shortVersion;
        },

        /**
         * Convenient alias to {@link Ext.Version#isGreaterThan isGreaterThan}
         * @param {String/Number} target
         * @return {Boolean}
         */
        gt: function() {
            return this.isGreaterThan.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isLessThan isLessThan}
         * @param {String/Number} target
         * @return {Boolean}
         */
        lt: function() {
            return this.isLessThan.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isGreaterThanOrEqual isGreaterThanOrEqual}
         * @param {String/Number} target
         * @return {Boolean}
         */
        gtEq: function() {
            return this.isGreaterThanOrEqual.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isLessThanOrEqual isLessThanOrEqual}
         * @param {String/Number} target
         * @return {Boolean}
         */
        ltEq: function() {
            return this.isLessThanOrEqual.apply(this, arguments);
        }
    });

    Ext.apply(Version, {
        // @private
        releaseValueMap: {
            'dev': -6,
            'alpha': -5,
            'a': -5,
            'beta': -4,
            'b': -4,
            'rc': -3,
            '#': -2,
            'p': -1,
            'pl': -1
        },

        /**
         * Converts a version component to a comparable value.
         *
         * @static
         * @param {Object} value The value to convert
         * @return {Object}
         */
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        /**
         * Compare 2 specified versions, starting from left to right. If a part contains special version strings,
         * they are handled in the following order:
         * 'dev' < 'alpha' = 'a' < 'beta' = 'b' < 'RC' = 'rc' < '#' < 'pl' = 'p' < 'anything else'
         *
         * @static
         * @param {String} current The current version to compare to.
         * @param {String} target The target version to compare to.
         * @return {Number} Returns -1 if the current version is smaller than the target version, 1 if greater, and 0 if they're equivalent.
         */
        compare: function(current, target) {
            var currentValue, targetValue, i;

            current = new Version(current).toArray();
            target = new Version(target).toArray();

            for (i = 0; i < Math.max(current.length, target.length); i++) {
                currentValue = this.getComponentValue(current[i]);
                targetValue = this.getComponentValue(target[i]);

                if (currentValue < targetValue) {
                    return -1;
                } else if (currentValue > targetValue) {
                    return 1;
                }
            }

            return 0;
        }
    });

    Ext.apply(Ext, {
        /**
         * @private
         */
        versions: {},

        /**
         * @private
         */
        lastRegisteredVersion: null,

        /**
         * Set version number for the given package name.
         *
         * @param {String} packageName The package name, for example: 'core', 'touch', 'extjs'.
         * @param {String/Ext.Version} version The version, for example: '1.2.3alpha', '2.4.0-dev'.
         * @return {Ext}
         */
        setVersion: function(packageName, version) {
            Ext.versions[packageName] = new Version(version);
            Ext.lastRegisteredVersion = Ext.versions[packageName];

            return this;
        },

        /**
         * Get the version number of the supplied package name; will return the last registered version
         * (last `Ext.setVersion()` call) if there's no package name given.
         *
         * @param {String} packageName (Optional) The package name, for example: 'core', 'touch', 'extjs'.
         * @return {Ext.Version} The version.
         */
        getVersion: function(packageName) {
            if (packageName === undefined) {
                return Ext.lastRegisteredVersion;
            }

            return Ext.versions[packageName];
        },

        /**
         * Create a closure for deprecated code.
         *
         *     // This means Ext.oldMethod is only supported in 4.0.0beta and older.
         *     // If Ext.getVersion('extjs') returns a version that is later than '4.0.0beta', for example '4.0.0RC',
         *     // the closure will not be invoked
         *     Ext.deprecate('extjs', '4.0.0beta', function() {
         *         Ext.oldMethod = Ext.newMethod;
         *         // ...
         *     });
         *
         * @param {String} packageName The package name.
         * @param {String} since The last version before it's deprecated.
         * @param {Function} closure The callback function to be executed with the specified version is less than the current version.
         * @param {Object} scope The execution scope (`this`) if the closure
         */
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); // End Versioning

    Ext.setVersion('core', version);

})();

//@tag foundation,core
//@define Ext.String
//@require Ext.Version

/**
 * @class Ext.String
 *
 * A collection of useful static methods to deal with strings.
 * @singleton
 */

Ext.String = {
    trimRegex: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    escapeRe: /('|\\)/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,

    /**
     * Convert certain characters (&, <, >, and ") to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode.
     * @return {String} The encoded text.
     * @method
     */
    htmlEncode: (function() {
        var entities = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        }, keys = [], p, regex;

        for (p in entities) {
            keys.push(p);
        }

        regex = new RegExp('(' + keys.join('|') + ')', 'g');

        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                return entities[capture];
            });
        };
    })(),

    /**
     * Convert certain characters (&, <, >, and ") from their HTML character equivalents.
     * @param {String} value The string to decode.
     * @return {String} The decoded text.
     * @method
     */
    htmlDecode: (function() {
        var entities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        }, keys = [], p, regex;

        for (p in entities) {
            keys.push(p);
        }

        regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');

        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                if (capture in entities) {
                    return entities[capture];
                } else {
                    return String.fromCharCode(parseInt(capture.substr(2), 10));
                }
            });
        };
    })(),

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} string The content to append to the URL.
     * @return {String} The resulting URL.
     */
    urlAppend : function(url, string) {
        if (!Ext.isEmpty(string)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }

        return url;
    },

    /**
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     *
     *     @example
     *     var s = '  foo bar  ';
     *     alert('-' + s + '-'); // alerts "-  foo bar  -"
     *     alert('-' + Ext.String.trim(s) + '-'); // alerts "-foo bar-"
     *
     * @param {String} string The string to escape
     * @return {String} The trimmed string
     */
    trim: function(string) {
        return string.replace(Ext.String.trimRegex, "");
    },

    /**
     * Capitalize the given string.
     * @param {String} string
     * @return {String}
     */
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    },

    /**
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length.
     * @param {String} value The string to truncate.
     * @param {Number} length The maximum length to allow before truncating.
     * @param {Boolean} word `true` to try to find a common word break.
     * @return {String} The converted text.
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index !== -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            }
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * Escapes the passed string for use in a regular expression.
     * @param {String} string
     * @return {String}
     */
    escapeRegex: function(string) {
        return string.replace(Ext.String.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \.
     * @param {String} string The string to escape.
     * @return {String} The escaped string.
     */
    escape: function(string) {
        return string.replace(Ext.String.escapeRe, "\\$1");
    },

    /**
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.  Note that this method returns the new value
     * but does not change the current string.
     *
     *     // alternate sort directions
     *     sort = Ext.String.toggle(sort, 'ASC', 'DESC');
     *
     *     // instead of conditional logic:
     *     sort = (sort == 'ASC' ? 'DESC' : 'ASC');
     *
     * @param {String} string The current string.
     * @param {String} value The value to compare to the current string.
     * @param {String} other The new value to use if the string already equals the first value passed in.
     * @return {String} The new value.
     */
    toggle: function(string, value, other) {
        return string === value ? other : value;
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     *
     *     var s = Ext.String.leftPad('123', 5, '0');
     *     alert(s); // '00123'
     *
     * @param {String} string The original string.
     * @param {Number} size The total length of the output string.
     * @param {String} [character= ] (optional) The character with which to pad the original string (defaults to empty string " ").
     * @return {String} The padded string.
     */
    leftPad: function(string, size, character) {
        var result = String(string);
        character = character || " ";
        while (result.length < size) {
            result = character + result;
        }
        return result;
    },

    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     *
     *     var cls = 'my-class',
     *         text = 'Some text';
     *     var s = Ext.String.format('<div class="{0}">{1}</div>', cls, text);
     *     alert(s); // '<div class="my-class">Some text</div>'
     *
     * @param {String} string The tokenized string to be formatted.
     * @param {String...} values First param value to replace token `{0}`, then next
     * param to replace `{1}` etc.
     * @return {String} The formatted string.
     */
    format: function(format) {
        var args = Ext.Array.toArray(arguments, 1);
        return format.replace(Ext.String.formatRe, function(m, i) {
            return args[i];
        });
    },

    /**
     * Returns a string with a specified number of repetitions a given string pattern.
     * The pattern be separated by a different string.
     *
     *     var s = Ext.String.repeat('---', 4); // '------------'
     *     var t = Ext.String.repeat('--', 3, '/'); // '--/--/--'
     *
     * @param {String} pattern The pattern to repeat.
     * @param {Number} count The number of times to repeat the pattern (may be 0).
     * @param {String} sep An option string to separate each pattern.
     */
    repeat: function(pattern, count, sep) {
        for (var buf = [], i = count; i--; ) {
            buf.push(pattern);
        }
        return buf.join(sep || '');
    }
};

/**
 * Old alias to {@link Ext.String#htmlEncode}.
 * @deprecated Use {@link Ext.String#htmlEncode} instead.
 * @method
 * @member Ext
 * @alias Ext.String#htmlEncode
 */
Ext.htmlEncode = Ext.String.htmlEncode;


/**
 * Old alias to {@link Ext.String#htmlDecode}.
 * @deprecated Use {@link Ext.String#htmlDecode} instead.
 * @method
 * @member Ext
 * @alias Ext.String#htmlDecode
 */
Ext.htmlDecode = Ext.String.htmlDecode;

/**
 * Old alias to {@link Ext.String#urlAppend}.
 * @deprecated Use {@link Ext.String#urlAppend} instead.
 * @method
 * @member Ext
 * @alias Ext.String#urlAppend
 */
Ext.urlAppend = Ext.String.urlAppend;

//@tag foundation,core
//@define Ext.Array
//@require Ext.String

/**
 * @class Ext.Array
 * @singleton
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers.
 */
(function() {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            // This detects a bug in IE8 splice method:
            // see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; //41
            array.splice(13, 0, "XXX"); // add one element

            if (lengthBefore+1 != array.length) {
                return false;
            }
            // end IE8 bug

            return true;
        }(),
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = function() {
            var a = [1,2,3,4,5].sort(function(){ return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }(),
        supportsSliceOnNodeList = true,
        ExtArray;

    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    function fixArrayIndex (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    }

    /*
    Does the same work as splice, but with a slightly more convenient signature. The splice
    method has bugs in IE8, so this is the implementation we use on that platform.

    The rippling of items in the array can be tricky. Consider two use cases:

                  index=2
                  removeCount=2
                 /=====\
        +---+---+---+---+---+---+---+---+
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+---+---+
                         /  \/  \/  \/  \
                        /   /\  /\  /\   \
                       /   /  \/  \/  \   +--------------------------+
                      /   /   /\  /\   +--------------------------+   \
                     /   /   /  \/  +--------------------------+   \   \
                    /   /   /   /+--------------------------+   \   \   \
                   /   /   /   /                             \   \   \   \
                  v   v   v   v                               v   v   v   v
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        | 0 | 1 | 4 | 5 | 6 | 7 |       | 0 | 1 | a | b | c | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        A                               B        \=========/
                                                 insert=[a,b,c]

    In case A, it is obvious that copying of [4,5,6,7] must be left-to-right so
    that we don't end up with [0,1,6,7,6,7]. In case B, we have the opposite; we
    must go right-to-left or else we would end up with [0,1,a,b,c,4,4,4,4].
    */
    function replaceSim (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index);

        // we try to use Array.push when we can for efficiency...
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            var remove = Math.min(removeCount, length - pos),
                tailOldPos = pos + remove,
                tailNewPos = tailOldPos + add - remove,
                tailCount = length - tailOldPos,
                lengthAfterRemove = length - remove,
                i;

            if (tailNewPos < tailOldPos) { // case A
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { // case B
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } // else, add == remove (nothing to do)

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; // truncate array
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; // reserves space
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative (array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    var erase = supportsSplice ? eraseNative : eraseSim,
        replace = supportsSplice ? replaceNative : replaceSim,
        splice = supportsSplice ? spliceNative : spliceSim;

    // NOTE: from here on, use erase, replace or splice (not native methods)...
    ExtArray = Ext.Array = {
        /**
         * Iterates an array or an iterable value and invoke the given callback function for each item.
         *
         *     var countries = ['Vietnam', 'Singapore', 'United States', 'Russia'];
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         console.log(name);
         *     });
         *
         *     var sum = function() {
         *         var sum = 0;
         *
         *         Ext.Array.each(arguments, function(value) {
         *             sum += value;
         *         });
         *
         *         return sum;
         *     };
         *
         *     sum(1, 2, 3); // returns 6
         *
         * The iteration can be stopped by returning false in the function callback.
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         if (name === 'Singapore') {
         *             return false; // break here
         *         }
         *     });
         *
         * {@link Ext#each Ext.each} is alias for {@link Ext.Array#each Ext.Array.each}
         *
         * @param {Array/NodeList/Object} iterable The value to be iterated. If this
         * argument is not iterable, the callback function is called once.
         * @param {Function} fn The callback function. If it returns `false`, the iteration stops and this method returns
         * the current `index`.
         * @param {Object} fn.item The item at the current `index` in the passed `array`
         * @param {Number} fn.index The current `index` within the `array`
         * @param {Array} fn.allItems The `array` itself which was passed as the first argument
         * @param {Boolean} fn.return Return false to stop iteration.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * @param {Boolean} [reverse=false] (Optional) Reverse the iteration order (loop from the end to the beginning).
         * @return {Boolean} See description for the `fn` parameter.
         */
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        /**
         * Iterates an array and invoke the given callback function for each item. Note that this will simply
         * delegate to the native `Array.prototype.forEach` method if supported. It doesn't support stopping the
         * iteration by returning `false` in the callback function like {@link Ext.Array#each}. However, performance
         * could be much better in modern browsers comparing with {@link Ext.Array#each}
         *
         * @param {Array} array The array to iterate.
         * @param {Function} fn The callback function.
         * @param {Object} fn.item The item at the current `index` in the passed `array`.
         * @param {Number} fn.index The current `index` within the `array`.
         * @param {Array}  fn.allItems The `array` itself which was passed as the first argument.
         * @param {Object} scope (Optional) The execution scope (`this`) in which the specified function is executed.
         */
        forEach: supportsForEach ? function(array, fn, scope) {
                return array.forEach(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        /**
         * Get the index of the provided `item` in the given `array`, a supplement for the
         * missing arrayPrototype.indexOf in Internet Explorer.
         *
         * @param {Array} array The array to check.
         * @param {Object} item The item to look for.
         * @param {Number} from (Optional) The index at which to begin the search.
         * @return {Number} The index of item in the array (or -1 if it is not found).
         */
        indexOf: (supportsIndexOf) ? function(array, item, from) {
            return array.indexOf(item, from);
        } : function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Checks whether or not the given `array` contains the specified `item`.
         *
         * @param {Array} array The array to check.
         * @param {Object} item The item to look for.
         * @return {Boolean} `true` if the array contains the item, `false` otherwise.
         */
        contains: supportsIndexOf ? function(array, item) {
            return array.indexOf(item) !== -1;
        } : function(array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array.
         *
         *     function test() {
         *         var args = Ext.Array.toArray(arguments),
         *             fromSecondToLastArgs = Ext.Array.toArray(arguments, 1);
         *
         *         alert(args.join(' '));
         *         alert(fromSecondToLastArgs.join(' '));
         *     }
         *
         *     test('just', 'testing', 'here'); // alerts 'just testing here';
         *                                      // alerts 'testing here';
         *
         *     Ext.Array.toArray(document.getElementsByTagName('div')); // will convert the NodeList into an array
         *     Ext.Array.toArray('splitted'); // returns ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
         *     Ext.Array.toArray('splitted', 0, 3); // returns ['s', 'p', 'l', 'i']
         *
         * {@link Ext#toArray Ext.toArray} is alias for {@link Ext.Array#toArray Ext.Array.toArray}
         *
         * @param {Object} iterable the iterable object to be turned into a true Array.
         * @param {Number} [start=0] (Optional) a zero-based index that specifies the start of extraction.
         * @param {Number} [end=-1] (Optional) a zero-based index that specifies the end of extraction.
         * @return {Array}
         */
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        /**
         * Plucks the value of a property from each item in the Array. Example:
         *
         *     Ext.Array.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         *
         * @param {Array/NodeList} array The Array of items to pluck the value from.
         * @param {String} propertyName The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        /**
         * Creates a new array with the results of calling a provided function on every element in this array.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Array} results
         */
        map: supportsMap ? function(array, fn, scope) {
            return array.map(fn, scope);
        } : function(array, fn, scope) {
            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        /**
         * Executes the specified function for each array element until the function returns a falsy value.
         * If such an item is found, the function will return `false` immediately.
         * Otherwise, it will return `true`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Boolean} `true` if no `false` value is returned by the callback function.
         */
        every: function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.every must have a callback function passed as second argument.');
            }
            //</debug>
            if (supportsEvery) {
                return array.every(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Executes the specified function for each array element until the function returns a truthy value.
         * If such an item is found, the function will return `true` immediately. Otherwise, it will return `false`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Boolean} `true` if the callback function returns a truthy value.
         */
        some: function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.some must have a callback function passed as second argument.');
            }
            //</debug>
            if (supportsSome) {
                return array.some(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Filter through an array and remove empty item as defined in {@link Ext#isEmpty Ext.isEmpty}.
         *
         * See {@link Ext.Array#filter}
         *
         * @param {Array} array
         * @return {Array} results
         */
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * Returns a new array with unique items.
         *
         * @param {Array} array
         * @return {Array} results
         */
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        /**
         * Creates a new array with all of the elements of this array for which
         * the provided filtering function returns `true`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Array} results
         */
        filter: function(array, fn, scope) {
            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * Converts a value to an array if it's not already an array; returns:
         *
         * - An empty array if given value is `undefined` or `null`
         * - Itself if given value is already an array
         * - An array copy if given value is {@link Ext#isIterable iterable} (arguments, NodeList and alike)
         * - An array with one item which is the given value, otherwise
         *
         * @param {Object} value The value to convert to an array if it's not already is an array.
         * @param {Boolean} [newReference=false] (Optional) `true` to clone the given array and return a new reference if necessary.
         * @return {Array} array
         */
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            if (value && value.length !== undefined && typeof value !== 'string') {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        /**
         * Removes the specified item from the array if it exists.
         *
         * @param {Array} array The array.
         * @param {Object} item The item to remove.
         * @return {Array} The passed array itself.
         */
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        /**
         * Push an item into the array only if the array doesn't contain it yet.
         *
         * @param {Array} array The array.
         * @param {Object} item The item to include.
         */
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        /**
         * Clone a flat array without referencing the previous one. Note that this is different
         * from `Ext.clone` since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
         * for `Array.prototype.slice.call(array)`.
         *
         * @param {Array} array The array
         * @return {Array} The clone array
         */
        clone: function(array) {
            return slice.call(array);
        },

        /**
         * Merge multiple arrays into one with unique items.
         *
         * {@link Ext.Array#union} is alias for {@link Ext.Array#merge}
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} merged
         */
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        /**
         * Merge multiple arrays into one with unique items that exist in all of the arrays.
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} intersect
         */
        intersect: function() {
            var intersect = [],
                arrays = slice.call(arguments),
                item, minArray, itemIndex, arrayIndex;

            if (!arrays.length) {
                return intersect;
            }

            //Find the Smallest Array
            arrays = arrays.sort(function(a, b) {
                if (a.length > b.length) {
                    return 1;
                } else if (a.length < b.length) {
                    return -1;
                } else {
                    return 0;
                }
            });

            //Remove duplicates from smallest array
            minArray = ExtArray.unique(arrays[0]);

            //Populate intersecting values
            for (itemIndex = 0; itemIndex < minArray.length; itemIndex++) {
                item = minArray[itemIndex];
                for (arrayIndex = 1; arrayIndex < arrays.length; arrayIndex++) {
                    if (arrays[arrayIndex].indexOf(item) === -1) {
                        break;
                    }

                    if (arrayIndex == (arrays.length - 1)) {
                        intersect.push(item);
                    }
                }
            }

            return intersect;
        },

        /**
         * Perform a set difference A-B by subtracting all items in array B from array A.
         *
         * @param {Array} arrayA
         * @param {Array} arrayB
         * @return {Array} difference
         */
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        /**
         * Returns a shallow copy of a part of an array. This is equivalent to the native
         * call `Array.prototype.slice.call(array, begin, end)`. This is often used when "array"
         * is "arguments