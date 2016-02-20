Ext.define('Lumen.controller.util.QueryData',{

    constructor: function (queryString, preserveDuplicates) {
        this.params = {};
        this.url = "";//The url without the params.


        // if a query string wasn't specified, use the query string from the URL
        if (queryString == undefined) {
            queryString = location.search ? location.search : '';
        }
        this.loadParams(queryString, preserveDuplicates, this.params);
    },

    loadParams: function (queryString, preserveDuplicates, params) {
        // remove the leading question mark from the query string if it is present
        if (queryString.indexOf('?') >= 0) {
            this.url = queryString.substring(0, queryString.indexOf('?'))
            queryString = queryString.substring(queryString.indexOf('?') + 1);
        }
        // check whether the query string is empty
        if (queryString.length > 0) {

            // replace plus signs in the query string with spaces
            queryString = queryString.replace(/\+/g, ' ');

            // split the query string around ampersands and semicolons
            var queryComponents = queryString.split(/[&;]/g);

            // loop over the query string components
            for (var index = 0; index < queryComponents.length; index++) {

                // extract this component's key-value pair
                var keyValuePair = queryComponents[index].split('=');
                var key = decodeURIComponent(keyValuePair[0]);
                var value = keyValuePair.length > 1 ? decodeURIComponent(keyValuePair[1]) : '';

                // check whether duplicates should be preserved
                if (preserveDuplicates) {

                    // create the value array if necessary and store the value
                    if (!(key in this)) {
                        params[key] = [];
                    }
                    params[key].push(value);

                } else {

                    // store the value
                    params[key] = value;

                }

            }

        }
        return queryString;
    },

    get: function (key) {
        this.initialize();
        if (typeof this.params[key] != "undefined") {
            return this.params[key];
        } else {
            return null;
        }
    },

    initialize: function () {
        if (!Lumen.controller.util.QueryData.outerFrameData) {
            if(!this.inIframe()) {
                //If this isn't in an iframe there's nothing to do or wait for.
                Lumen.getApplication().fireEvent(Lumen.WINDOW_INITIALIZED, {});
                Lumen.controller.util.QueryData.outerFrameData = {queryString: ""};
            }
            Lumen.controller.util.QueryData.staticInitialize();
        }
        if (Lumen.controller.util.QueryData.outerFrameData) {
            this.loadParams(Lumen.controller.util.QueryData.outerFrameData.queryString, false, this.params);
        }

        if(!Lumen.controller.util.QueryData.initNotificationSent && Lumen.controller.util.QueryData.outerFrameData) {
            Lumen.controller.util.QueryData.initNotificationSent = true;
            Lumen.getApplication().fireEvent(Lumen.WINDOW_INITIALIZED, {});
        }
    },

    inIframe: function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

});

Lumen.controller.util.QueryData.initNotificationSent = false;

Lumen.controller.util.QueryData.staticInitialize = function() {
    var params = {
        method: "initialize"
    }
    window.parent.postMessage(Ext.encode(params), "*");
}


Lumen.controller.util.QueryData.eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var LumenEventer = window[Lumen.controller.util.QueryData.eventMethod];
Lumen.controller.util.QueryData.messageEvent = Lumen.controller.util.QueryData.eventMethod == "attachEvent" ? "onmessage" : "message";


// Listen to message from child IFrame window
LumenEventer(Lumen.controller.util.QueryData.messageEvent, function (e, origin) {
    try {
        //Some clients other than ours may
        //fire this event.  It should be ignored.
        var params = JSON.parse(e.data);
    } catch (e) {
    }

    if(params && params.method == "initialize" && Lumen.getApplication && Lumen.getApplication()) {
        Lumen.controller.util.QueryData.outerFrameData = params.data;
        Lumen.getApplication().fireEvent(Lumen.WINDOW_INITIALIZED, {});
    }
}, false);

//If the outer frame initializes first.
Lumen.controller.util.QueryData.staticInitialize();