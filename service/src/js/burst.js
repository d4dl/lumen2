var QMBurst = function () {

    this.waitForAWhile(5);
    // Here "addEventListener" is for standards-compliant web browsers and "attachEvent" is for IE Browsers.
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];

    // Now...
    // if
    //    "attachEvent", then we need to select "onmessage" as the event.
    // if
    //    "addEventListener", then we need to select "message" as the event

    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    var self = this;
    eventer(messageEvent, function (e, origin) {
        if (e.origin == 'https://quickmit.net' || e.origin == 'http://dev.quickmit.net') {
            try {
                //Some clients other than ours may
                //fire this event.  It should be ignored.
                var params = JSON.parse(e.data);
            } catch (e) {}

            if (params) {
                if (params.method == "resizeOuterIframe") {
                    self.resizeOuterIframe(params.height);
                    //self.breakout();
                } else if (params.method == "initialize") {
                    self.waitForAWhile(0);
                    //If this initialized first and quickmit lags.
                    self.initQuickmitFrame();
                } else if (params.method == "relocate") {
                    window.location.href = params.url
                } else if (params.method == "breakout") {
                    self.breakout(params.height, params.heightOfTargetNode);
                }
                //Use for login.
                //        if(params.method = "reload") {
                //            location.reload();
                //        }
            }
        }
    }, false);

    this.initQuickmitFrame();
};

QMBurst.prototype.getQuickmitFrame = function () {
    var outerIFrame = document.getElementById("quickMitOuterIFrame");
    return outerIFrame;
};

QMBurst.prototype.resizeOuterIframe = function (height) {
    var outerIFrame = this.getQuickmitFrame();
    outerIFrame.style.height = (height) + "px";
    //console.log("Resizing " + height);
};

QMBurst.prototype.breakout = function (height, heightOfTargetNode) {
    var parent = this.getQuickmitFrame();
    for (var j = 0; j < height; j++) {
        var parent = parent.parentNode;
        if(parent) {
            console.log("Crawling up nodes. id: '" + parent.id + ": " + j);
        }
    }
    if(heightOfTargetNode) {
        var target = this.getQuickmitFrame();
        for (var j = 0; j < heightOfTargetNode; j++) {
            var target = parent.parentNode;
        }
    }
    this.animateFullWidth(parent, target);
};

QMBurst.prototype.animateFullWidth = function (node, targetNode) {
    if(node.parentNode) {
        var targetWidth = node.parentNode.clientWidth;
        var clientWidth = node.clientWidth;
        var newWidth = clientWidth;

        function doGrow() {
            newWidth += 20;
            newWidth = Math.min(targetWidth, newWidth);
            var nodeToResize = targetNode || node;
            node.style.width = newWidth + 'px';
            if (newWidth < targetWidth) {
                setTimeout(doGrow, 20);
            }
        }
        doGrow();
    }
};

// Listen to message from child IFrame window
QMBurst.prototype.initQuickmitFrame = function () {
    var outerIFrame = this.getQuickmitFrame();
    var params = {
        method: "initialize",
        data: {
            queryString: window.location.search
        }
    };
    outerIFrame.contentWindow.postMessage(JSON.stringify(params), "*");
    var xhr = new XMLHttpRequest();
    setInterval(function(){
        xhr.onload = function(){
           // console.log(this.responseText + " == " + QMBurst.version);
            if(!QMBurst.pendingReload && this.responseText > QMBurst.version) {
                //console.log("Version is out of date");
                var result = confirm("A new version of the application system has been installed.  " +
                    "If you have any unsaved changes, click Cancel to dismiss this dialog.  " +
                    "Then save any unsaved changes and refresh your browser. " +
                    "This application will refresh automatically 3 minutes after you click Cancel.  Click OK to refresh now.");
                if (result == true) {
                    window.location.href  = window.location.href
                }  else {
                    QMBurst.pendingReload = true; //avoid notifying the users more than once.
                    setTimeout(function(){window.location.href  = window.location.href}, 3 * 60 * 1000);
                }
            }
        };
        xhr.open("GET", "https://quickmit.net/clients/installation/development/php/services/versionService.php?polling=", false);
        xhr.send();
    }, 3 * 60 * 1000);//every 3 minutes.
};

QMBurst.prototype.waitForAWhile = function (duration) {
    var xhr = new XMLHttpRequest();
    //xhr.open("GET", "http://quickmit.net/wait.php?duration=" + duration, false);
    //xhr.send();
};

var quickmitBurst = new QMBurst();
//If quickmit initialized first
//this is late to the game.

//This is the cache busting mechanism.
//Deploy this file first with the newest version.
//Then, change the SERVER_VERSION in config.php to match.
//All users will then have 3 minutes to reload their browser or it will be done for them.
QMBurst.version = 25;

