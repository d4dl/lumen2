Ext.define('Lumen.view.Main', {
    extend: 'Ext.container.Container',
    layout: 'vbox',
    renderTo: "lumenbody",
    id: "lumenMainApplication",
    autoDestroy: true,
    width: Lumen.MAIN_CONTAINER_WIDTH,
    listeners: {
        boxready: function (component, width, height, opts) {
            if(Lumen.BREAKOUT_HEIGHT) {
                //component.resizeParent(width, height, 0, 0, opts);
                //Lumen.log("Inside ifram changing size. New height: " + height);
                var params = {
                    method: "breakout",
                    height: Lumen.BREAKOUT_HEIGHT,
                    heightOfTargetNode: Lumen.BREAKOUT_TARGET_HEIGHT
                }
                window.parent.postMessage(Ext.encode(params), "*");
            }
        },
        resize: function (component, width, height, oldWidth, oldHeight, opts) {
            //Lumen.log("Inside ifram changing size. New height: " + height);
            var params = {
                method: "resizeOuterIframe",
                height: height
            }
            window.parent.postMessage(Ext.encode(params), "*");
        }
    },
    resizeParent: function (width, height, oldWidth, oldHeight, opts) {
        //        if((window.parent != window.self) && height) {
        //            //alert("resizing parent to " + height);
        //            window.parent.style.height = (height + 20) + "px";
        //        } else {
        //            alert("Not resizing parent.  No parent.");
        //        }
    },
    items: [
        {
            xtype: 'container',
            //MENU CONTAINER
            id: 'menuContainer1',
            flex: 100,
            width: "100%"
        },
        {
            //MAIN DISPLAY
            // x: 200,
            xtype: 'container',
            id: 'mainDisplay',
            autoDestroy: true,
            flex: 100,
            width: "100%"
        }
    ]
});
